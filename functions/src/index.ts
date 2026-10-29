import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, DocumentSnapshot } from 'firebase-admin/firestore';
import { setGlobalOptions } from 'firebase-functions/v2';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import {
  WELCOME_POINTS,
  CouponData,
  ProductData,
  assertStock,
  buildLines,
  computeTotals,
  evaluateCoupon,
  normalizeItems,
} from './pricing';

initializeApp();
setGlobalOptions({ region: 'us-central1', maxInstances: 10 });

const db = getFirestore();

const str = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

const toProduct = (snap: DocumentSnapshot): ProductData | null => (snap.exists ? (snap.data() as ProductData) : null);

const toCoupon = (snap: DocumentSnapshot): CouponData | undefined => {
  if (!snap.exists) return undefined;
  const d = snap.data()!;
  const exp = d.expira_el as Timestamp | null | undefined;
  return {
    codigo: String(d.codigo ?? snap.id),
    tipo: d.tipo === 'fixed' ? 'fixed' : 'percent',
    valor: Number(d.valor),
    minimo_compra: Number(d.minimo_compra ?? 0),
    activo: d.activo === true,
    expira_el_ms: exp && typeof exp.toMillis === 'function' ? exp.toMillis() : null,
  };
};

const cleanCode = (raw: unknown): string => {
  const code = str(raw, 50).toUpperCase();
  if (!code) throw new HttpsError('invalid-argument', 'Por favor ingresa un código de cupón.');
  if (!/^[A-Z0-9_-]{1,50}$/.test(code)) {
    throw new HttpsError('not-found', 'El cupón no existe o ha expirado. Prueba con CAFE15 o VISTRO50.');
  }
  return code;
};

const todayHN = (): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Tegucigalpa' }).format(new Date());

/* ------------------------------------------------------------------ */
/* createProfile: crea users/{uid} en el servidor (puntos de bienvenida y rol) */
/* ------------------------------------------------------------------ */
export const createProfile = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Debes iniciar sesión.');
  const uid = request.auth.uid;
  const email = String(request.auth.token.email ?? '').toLowerCase();
  const data = (request.data ?? {}) as Record<string, unknown>;

  const nombre = str(data.nombre_completo, 100) || str(request.auth.token.name, 100) || email.split('@')[0] || 'Cliente';
  const telefono = str(data.telefono, 30);
  const direccion = str(data.direccion, 200);

  const ref = db.doc(`users/${uid}`);
  const profile = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists) return snap.data()!; // idempotente: no se vuelven a dar puntos
    const fresh = {
      nombre_completo: nombre,
      email,
      telefono,
      direccion,
      eco_points: WELCOME_POINTS,
      role: 'cliente',
      created_at: FieldValue.serverTimestamp(),
    };
    tx.create(ref, fresh);
    return { ...fresh, created_at: null };
  });

  return {
    user: {
      id: uid,
      nombre_completo: profile.nombre_completo,
      email: profile.email,
      telefono: profile.telefono,
      direccion: profile.direccion,
      eco_points: profile.eco_points,
      role: profile.role,
    },
  };
});

/* ------------------------------------------------------------------ */
/* applyCoupon: recibe ítems (NO subtotal) y calcula con precios de la BD */
/* ------------------------------------------------------------------ */
export const applyCoupon = onCall(async (request) => {
  const data = (request.data ?? {}) as Record<string, unknown>;
  const code = cleanCode(data.code);
  const items = normalizeItems(data.items);

  const ids = [...new Set(items.map((i) => i.productId))];
  const snaps = await db.getAll(...ids.map((id) => db.doc(`products/${id}`)), db.doc(`coupons/${code}`));
  const products = new Map<number, ProductData>();
  ids.forEach((id, i) => {
    const p = toProduct(snaps[i]);
    if (p) products.set(id, p);
  });
  const couponSnap = snaps[snaps.length - 1];

  const { subtotal } = buildLines(items, products);
  if (subtotal <= 0) {
    throw new HttpsError('failed-precondition', 'El subtotal del pedido debe ser mayor a 0 para aplicar cupones.');
  }

  const c = evaluateCoupon(toCoupon(couponSnap), subtotal, Date.now());
  return {
    message: `¡Cupón '${code}' aplicado con éxito!`,
    data: {
      code: c.code,
      tipo: c.tipo,
      valor: c.valor,
      subtotal_server: subtotal,
      descuento: c.descuento,
      total_con_cupon: Math.max(0, subtotal - c.descuento),
    },
  };
});

/* ------------------------------------------------------------------ */
/* createOrder: transacción atómica (stock, precios, cupón, puntos Eco)   */
/* ------------------------------------------------------------------ */
export const createOrder = onCall(async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Debes iniciar sesión para realizar un pedido.');
  const uid = request.auth.uid;
  const data = (request.data ?? {}) as Record<string, unknown>;

  const items = normalizeItems(data.items);
  const notas = str(data.notas, 500);
  const sucursalInput = str(data.sucursal, 100) || 'Mall Multiplaza';
  const couponCode = str(data.cupon_codigo ?? data.cupon, 50) ? cleanCode(data.cupon_codigo ?? data.cupon) : '';
  const puntosPedidos = Math.max(0, Math.floor(Number(data.puntos_canjeados ?? 0)) || 0);

  // Sucursal (dato estático: se resuelve fuera de la transacción)
  let sucursalNombre = '';
  let sucursalId: number | null = null;
  {
    const byName = await db.collection('sucursales').where('nombre', '==', sucursalInput).limit(1).get();
    let doc = byName.docs[0];
    if (!doc && /^\d{1,4}$/.test(sucursalInput)) {
      const byId = await db.doc(`sucursales/${sucursalInput}`).get();
      if (byId.exists) doc = byId as unknown as typeof doc;
    }
    if (!doc) throw new HttpsError('invalid-argument', 'La sucursal de retiro seleccionada no es válida.');
    sucursalNombre = String(doc.data()!.nombre);
    sucursalId = Number(doc.data()!.id ?? doc.id);
  }

  const productIds = [...new Set(items.map((i) => i.productId))];

  const result = await db.runTransaction(async (tx) => {
    const userRef = db.doc(`users/${uid}`);
    const counterRef = db.doc('counters/orders');
    const prodRefs = productIds.map((id) => db.doc(`products/${id}`));
    const refs = [userRef, counterRef, ...prodRefs];
    if (couponCode) refs.push(db.doc(`coupons/${couponCode}`));

    // TODAS las lecturas primero (requisito de Firestore), luego las escrituras.
    const snaps = await tx.getAll(...refs);
    const userSnap = snaps[0];
    const counterSnap = snaps[1];
    const products = new Map<number, ProductData>();
    productIds.forEach((id, i) => {
      const p = toProduct(snaps[2 + i]);
      if (p) products.set(id, p);
    });

    if (!userSnap.exists) throw new HttpsError('failed-precondition', 'No se encontró tu perfil de usuario.');
    const user = userSnap.data()!;

    const { lines, subtotal, qtyByProduct } = buildLines(items, products);
    assertStock(qtyByProduct, products);

    let descuentoCupon = 0;
    let cuponAplicado: string | null = null;
    if (couponCode) {
      const c = evaluateCoupon(toCoupon(snaps[snaps.length - 1]), subtotal, Date.now());
      descuentoCupon = c.descuento;
      cuponAplicado = c.code;
    }

    const t = computeTotals({
      subtotal,
      descuentoCupon,
      puntosCanjeados: puntosPedidos,
      puntosDisponibles: Number(user.eco_points ?? 0),
    });

    const orderId = Number(counterSnap.exists ? counterSnap.data()!.last : 1000) + 1;

    // Escrituras
    for (const [pid, qty] of qtyByProduct) {
      tx.update(db.doc(`products/${pid}`), { stock: Number(products.get(pid)!.stock) - qty });
    }
    tx.update(userRef, { eco_points: t.balance });
    tx.set(counterRef, { last: orderId });
    tx.set(db.doc(`orders/${orderId}`), {
      id: orderId,
      usuario_id: uid,
      cliente_nombre: user.nombre_completo ?? '',
      cliente_email: user.email ?? '',
      fecha_pedido: todayHN(),
      created_at: FieldValue.serverTimestamp(),
      sucursal: sucursalNombre,
      sucursal_id: sucursalId,
      subtotal,
      descuento: t.descuentoTotal,
      descuento_cupon: descuentoCupon,
      cupon_aplicado: cuponAplicado,
      puntos_canjeados: t.puntosADescontar,
      descuento_puntos: t.descuentoPuntos,
      total: t.total,
      puntos_ganados: t.puntosGanados,
      estado: 'pendiente',
      notas,
      items: lines.map((l) => ({
        id: l.producto_id,
        producto_id: l.producto_id,
        variante_id: l.variante_id,
        variante: l.variante_nombre,
        variante_nombre: l.variante_nombre,
        nombre: l.nombre,
        cantidad: l.cantidad,
        precio_unitario: l.precio_unitario,
        subtotal: l.subtotal,
        imagen_url: l.imagen_url,
      })),
    });

    return { orderId, subtotal, descuentoCupon, t, lines };
  });

  return {
    message: '¡Pedido confirmado exitosamente! Tu café ya se está preparando.',
    data: {
      order_id: result.orderId,
      subtotal: result.subtotal,
      descuento_cupon: result.descuentoCupon,
      descuento_puntos: result.t.descuentoPuntos,
      total: result.t.total,
      puntos_ganados: result.t.puntosGanados,
      puntos_canjeados: result.t.puntosADescontar,
      eco_points_balance: result.t.balance,
      sucursal: sucursalNombre,
      items: result.lines,
    },
  };
});
