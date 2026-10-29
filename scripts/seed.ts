/**
 * scripts/seed.ts — carga datos iniciales en Firebase.
 *
 *   npm run seed            -> emulador local (por defecto, SEGURO)
 *   npm run seed -- --prod  -> proyecto real (requiere credenciales; ver README)
 *
 * Carga: productos + variantes, sucursales, cupones, blog y (solo emulador) un usuario demo.
 */
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { INITIAL_PRODUCTS, BLOG_POSTS, INITIAL_ORDERS, INITIAL_USER } from '../src/data/initialData';

const PROJECT_ID = 'caffe-vistri';
const isProd = process.argv.includes('--prod');

if (!isProd) {
  process.env.FIRESTORE_EMULATOR_HOST ??= '127.0.0.1:8080';
  process.env.FIREBASE_AUTH_EMULATOR_HOST ??= '127.0.0.1:9099';
} else if (!process.argv.includes('--yes')) {
  console.error('⚠️  Vas a escribir en PRODUCCIÓN. Repite el comando agregando --yes para confirmar.');
  process.exit(1);
}

initializeApp({ projectId: PROJECT_ID });
const db = getFirestore();

const BRANCHES = [
  {
    id: 1,
    nombre: 'Mall Multiplaza',
    ciudad: 'Tegucigalpa',
    direccion: 'Nivel 2, Food Court & Retail, Tegucigalpa, F.M.',
    telefono: '+504 2280-4500',
    horario: 'Lun - Dom: 7:00 AM - 9:00 PM',
    activo: true,
  },
  {
    id: 2,
    nombre: 'Mall Galerías',
    ciudad: 'San Pedro Sula',
    direccion: 'Nivel 1, Pasillo Central, San Pedro Sula, Cortés',
    telefono: '+504 2550-1200',
    horario: 'Lun - Dom: 8:00 AM - 8:30 PM',
    activo: true,
  },
];

// Cupones (solo legibles por Cloud Functions)
const COUPONS = [
  { codigo: 'CAFE15', tipo: 'percent', valor: 15, minimo_compra: 0, activo: true, expira_el: null },
  { codigo: 'VISTRO50', tipo: 'fixed', valor: 50, minimo_compra: 200, activo: true, expira_el: null },
  { codigo: 'BARISTA20', tipo: 'percent', valor: 20, minimo_compra: 350, activo: true, expira_el: null },
];

const DEMO_UID = 'demo-admin';
const DEMO_PASSWORD = 'Cafe1234!';

async function main() {
  console.log(`→ Destino: ${isProd ? 'PRODUCCIÓN' : 'EMULADOR'} (${PROJECT_ID})`);
  const batch = db.batch();

  // Productos con variantes embebidas (ids de variante únicos globalmente)
  let variantId = 1;
  for (const p of INITIAL_PRODUCTS) {
    const variantes = (p.variantes ?? []).map((v) => ({
      id: variantId++,
      nombre_variante: v.nombre_variante,
      precio_adicional: v.precio_adicional,
    }));
    batch.set(db.doc(`products/${p.id}`), { ...p, variantes, activo: true });
  }

  for (const b of BRANCHES) batch.set(db.doc(`sucursales/${b.id}`), b);
  for (const c of COUPONS) batch.set(db.doc(`coupons/${c.codigo}`), c);
  for (const post of BLOG_POSTS) batch.set(db.doc(`blog_posts/${post.id}`), post);

  const lastOrderId = isProd ? 1000 : Math.max(1000, ...INITIAL_ORDERS.map((o) => o.id));
  batch.set(db.doc('counters/orders'), { last: lastOrderId });

  await batch.commit();
  console.log(
    `✔ ${INITIAL_PRODUCTS.length} productos, ${BRANCHES.length} sucursales, ${COUPONS.length} cupones, ${BLOG_POSTS.length} artículos`
  );

  // Usuario demo + pedidos de ejemplo: solo en el emulador
  if (!isProd) {
    const auth = getAuth();
    try {
      await auth.getUser(DEMO_UID);
      await auth.updateUser(DEMO_UID, { email: INITIAL_USER.email, password: DEMO_PASSWORD });
    } catch {
      await auth.createUser({
        uid: DEMO_UID,
        email: INITIAL_USER.email,
        password: DEMO_PASSWORD,
        displayName: INITIAL_USER.nombre_completo,
      });
    }
    await db.doc(`users/${DEMO_UID}`).set({
      nombre_completo: INITIAL_USER.nombre_completo,
      email: INITIAL_USER.email,
      telefono: INITIAL_USER.telefono,
      direccion: INITIAL_USER.direccion,
      eco_points: INITIAL_USER.eco_points,
      role: 'admin',
      created_at: Timestamp.now(),
    });

    const ob = db.batch();
    for (const o of INITIAL_ORDERS) {
      ob.set(db.doc(`orders/${o.id}`), {
        ...o,
        usuario_id: DEMO_UID,
        cliente_nombre: INITIAL_USER.nombre_completo,
        cliente_email: INITIAL_USER.email,
        created_at: Timestamp.fromDate(new Date(`${o.fecha_pedido}T12:00:00-06:00`)),
        items: o.items.map((i) => ({ ...i, producto_id: i.id, subtotal: i.cantidad * i.precio_unitario })),
      });
    }
    await ob.commit();
    console.log(`✔ Usuario demo: ${INITIAL_USER.email} / ${DEMO_PASSWORD} (admin, ${INITIAL_USER.eco_points} Puntos Eco)`);
  }
  console.log('✔ Seed completado.');
}

main().catch((e) => {
  console.error('✖ Error en el seed:', e?.message ?? e);
  process.exit(1);
});
