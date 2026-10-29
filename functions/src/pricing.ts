/**
 * Lógica de precios pura (sin acceso a Firestore) para poder probarla.
 * Todo cálculo de precios, descuentos y puntos se hace SOLO aquí, en el servidor.
 */
import { HttpsError } from 'firebase-functions/v2/https';

export const POINT_VALUE_LPS = 1; // 1 Punto Eco = L. 1.00 de descuento
export const POINTS_EARN_RATE = 0.1; // 10 % del total pagado
export const WELCOME_POINTS = 50;
export const MAX_ITEMS = 50;
export const MAX_QTY_PER_ITEM = 99;

export interface CartInput {
  productId: number;
  quantity: number;
  variantId?: number;
  nombre_variante?: string;
}

export interface VariantData {
  id: number;
  nombre_variante: string;
  precio_adicional: number;
}

export interface ProductData {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  imagen_url: string;
  activo?: boolean;
  variantes?: VariantData[];
}

export interface CartLine {
  producto_id: number;
  variante_id: number | null;
  variante_nombre: string | null;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  imagen_url: string;
}

export interface CouponData {
  codigo: string;
  tipo: 'percent' | 'fixed';
  valor: number;
  minimo_compra: number;
  activo: boolean;
  /** milisegundos desde epoch, o null si no expira */
  expira_el_ms: number | null;
}

export const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

const isPosInt = (n: unknown): n is number => typeof n === 'number' && Number.isInteger(n) && n > 0;

/** Valida y normaliza el carrito que llega del cliente (nunca se confía en precios del cliente). */
export function normalizeItems(raw: unknown): CartInput[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    throw new HttpsError('invalid-argument', 'El carrito no contiene productos para procesar.');
  }
  if (raw.length > MAX_ITEMS) {
    throw new HttpsError('invalid-argument', `El carrito supera el máximo de ${MAX_ITEMS} líneas.`);
  }
  return raw.map((r) => {
    const it = (r ?? {}) as Record<string, unknown>;
    const productId = Number(it.productId ?? it.producto_id ?? it.id);
    const quantity = Number(it.quantity ?? it.cantidad ?? 1);
    if (!isPosInt(productId)) {
      throw new HttpsError('invalid-argument', 'Producto inválido en el carrito.');
    }
    if (!isPosInt(quantity) || quantity > MAX_QTY_PER_ITEM) {
      throw new HttpsError('invalid-argument', `Cantidad inválida (1 a ${MAX_QTY_PER_ITEM}).`);
    }
    const variantIdRaw = it.variantId;
    const variantId = variantIdRaw == null ? undefined : Number(variantIdRaw);
    if (variantId !== undefined && !isPosInt(variantId)) {
      throw new HttpsError('invalid-argument', 'Variante inválida en el carrito.');
    }
    const nombre_variante =
      typeof it.nombre_variante === 'string' && it.nombre_variante.trim() ? it.nombre_variante.trim() : undefined;
    return { productId, quantity, variantId, nombre_variante };
  });
}

/** Construye las líneas del pedido con precios tomados de la base de datos. */
export function buildLines(
  items: CartInput[],
  products: Map<number, ProductData>
): { lines: CartLine[]; subtotal: number; qtyByProduct: Map<number, number> } {
  const lines: CartLine[] = [];
  const qtyByProduct = new Map<number, number>();
  let subtotal = 0;

  for (const item of items) {
    const p = products.get(item.productId);
    if (!p || p.activo === false) {
      throw new HttpsError('not-found', `El producto solicitado (ID: ${item.productId}) ya no está disponible.`);
    }

    let unit = Number(p.precio);
    let variantId: number | null = null;
    let variantName: string | null = null;

    if (item.variantId !== undefined || item.nombre_variante) {
      const v =
        (item.variantId !== undefined ? p.variantes?.find((x) => x.id === item.variantId) : undefined) ??
        (item.nombre_variante ? p.variantes?.find((x) => x.nombre_variante === item.nombre_variante) : undefined);
      if (!v) {
        throw new HttpsError('invalid-argument', `La variante seleccionada de '${p.nombre}' ya no está disponible.`);
      }
      variantId = v.id;
      variantName = v.nombre_variante;
      unit += Number(v.precio_adicional);
    }

    unit = round2(unit);
    const lineSubtotal = round2(unit * item.quantity);
    subtotal += lineSubtotal;
    qtyByProduct.set(p.id, (qtyByProduct.get(p.id) ?? 0) + item.quantity);

    lines.push({
      producto_id: p.id,
      variante_id: variantId,
      variante_nombre: variantName,
      nombre: p.nombre,
      cantidad: item.quantity,
      precio_unitario: unit,
      subtotal: lineSubtotal,
      imagen_url: p.imagen_url ?? '',
    });
  }

  return { lines, subtotal: round2(subtotal), qtyByProduct };
}

/** Valida stock sumando todas las líneas del mismo producto. */
export function assertStock(qtyByProduct: Map<number, number>, products: Map<number, ProductData>): void {
  for (const [id, qty] of qtyByProduct) {
    const p = products.get(id)!;
    if (Number(p.stock) < qty) {
      throw new HttpsError('failed-precondition', `Stock insuficiente para '${p.nombre}'. Disponibles: ${p.stock} unidades.`);
    }
  }
}

/** Evalúa un cupón contra el subtotal calculado en servidor. */
export function evaluateCoupon(
  coupon: CouponData | undefined,
  subtotal: number,
  nowMs: number
): { code: string; tipo: 'percent' | 'fixed'; valor: number; descuento: number } {
  if (!coupon || !coupon.activo) {
    throw new HttpsError('not-found', 'El cupón no existe o ha expirado. Prueba con CAFE15 o VISTRO50.');
  }
  if (coupon.expira_el_ms !== null && coupon.expira_el_ms < nowMs) {
    throw new HttpsError('failed-precondition', 'Este cupón ha expirado.');
  }
  if (subtotal < coupon.minimo_compra) {
    throw new HttpsError(
      'failed-precondition',
      `Este cupón requiere una compra mínima de L. ${coupon.minimo_compra.toFixed(2)}`
    );
  }
  const descuento =
    coupon.tipo === 'percent'
      ? round2(subtotal * (coupon.valor / 100))
      : round2(Math.min(subtotal, coupon.valor));
  return { code: coupon.codigo, tipo: coupon.tipo, valor: coupon.valor, descuento };
}

/** Totales finales: cupón → canje de Puntos Eco → puntos ganados. */
export function computeTotals(params: {
  subtotal: number;
  descuentoCupon: number;
  puntosCanjeados: number;
  puntosDisponibles: number;
}) {
  const { subtotal, descuentoCupon, puntosCanjeados, puntosDisponibles } = params;
  const remaining = round2(Math.max(0, subtotal - descuentoCupon));

  if (puntosCanjeados > puntosDisponibles) {
    throw new HttpsError(
      'failed-precondition',
      `No tienes suficientes Puntos Eco (disponibles: ${puntosDisponibles}).`
    );
  }

  // Solo se canjean puntos enteros y nunca más que el total restante.
  const puntosADescontar = Math.max(0, Math.min(Math.floor(puntosCanjeados), Math.floor(remaining / POINT_VALUE_LPS)));
  const descuentoPuntos = round2(puntosADescontar * POINT_VALUE_LPS);
  const total = round2(Math.max(0, remaining - descuentoPuntos));
  const puntosGanados = Math.round(total * POINTS_EARN_RATE);
  const balance = puntosDisponibles - puntosADescontar + puntosGanados;

  return {
    descuentoPuntos,
    puntosADescontar,
    total,
    puntosGanados,
    descuentoTotal: round2(descuentoCupon + descuentoPuntos),
    balance,
  };
}
