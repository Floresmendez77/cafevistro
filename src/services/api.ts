/**
 * src/services/api.ts
 * Cliente tipado sobre Firebase (Auth + Firestore + Cloud Functions).
 * Mantiene las mismas firmas que la versión PHP: cada método devuelve
 * { success, message, data } y nunca lanza por errores de negocio.
 *
 * Precios, descuentos, stock y Puntos Eco se calculan SOLO en Cloud Functions.
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from '../lib/firebase';
import { Product, BlogPost, Branch, Order, User } from '../types';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

type CartPayloadItem = { productId: number; quantity: number; variantId?: number; nombre_variante?: string };

const ok = <T>(data: T, message = 'OK'): ApiResponse<T> => ({ success: true, message, data });
const fail = <T = null>(message: string): ApiResponse<T> => ({ success: false, message, data: null as unknown as T });

const AUTH_MESSAGES: Record<string, string> = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/invalid-login-credentials': 'Correo o contraseña incorrectos.',
  'auth/user-not-found': 'Correo o contraseña incorrectos.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/invalid-email': 'El formato del correo electrónico es inválido.',
  'auth/email-already-in-use': 'Este correo electrónico ya está registrado. Inicia sesión.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/missing-password': 'Ingresa tu contraseña.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
  'auth/network-request-failed': 'Sin conexión con el servidor. Revisa tu internet.',
};

const errMessage = (err: unknown, fallback: string): string => {
  const e = err as { code?: string; message?: string } | undefined;
  if (e?.code && AUTH_MESSAGES[e.code]) return AUTH_MESSAGES[e.code];
  // Errores de negocio de Cloud Functions (HttpsError) traen mensaje en español.
  if (e?.code?.startsWith('functions/')) {
    const technical = ['functions/internal', 'functions/unavailable', 'functions/unknown'];
    if (technical.includes(e.code)) return fallback;
    if (e.message && e.message !== e.message.toUpperCase()) return e.message;
  }
  if (e?.code === 'permission-denied') return 'No tienes permiso para realizar esta acción.';
  return fallback;
};

/** Perfil users/{uid} -> User */
const toUser = (uid: string, d: Record<string, any>): User => ({
  id: uid,
  nombre_completo: d.nombre_completo ?? '',
  email: d.email ?? '',
  telefono: d.telefono ?? '',
  direccion: d.direccion ?? '',
  eco_points: Number(d.eco_points ?? 0),
  role: d.role === 'admin' ? 'admin' : 'cliente',
});

async function fetchProfile(uid: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? toUser(uid, snap.data()) : null;
}

async function callFn<T>(name: string, payload: unknown): Promise<T> {
  const res = await httpsCallable<unknown, T>(functions, name)(payload);
  return res.data;
}

type FnEnvelope<T> = { message: string; data: T };

const toOrder = (d: Record<string, any>): Order => ({
  id: Number(d.id),
  usuario_id: d.usuario_id,
  fecha_pedido: d.fecha_pedido ?? '',
  total: Number(d.total ?? 0),
  subtotal: Number(d.subtotal ?? 0),
  descuento: Number(d.descuento ?? 0),
  descuento_cupon: Number(d.descuento_cupon ?? 0),
  cupon_aplicado: d.cupon_aplicado ?? undefined,
  sucursal: d.sucursal ?? '',
  estado: d.estado ?? 'pendiente',
  puntos_ganados: Number(d.puntos_ganados ?? 0),
  puntos_canjeados: Number(d.puntos_canjeados ?? 0),
  cliente_nombre: d.cliente_nombre,
  cliente_email: d.cliente_email,
  items: Array.isArray(d.items) ? d.items : [],
});

export const api = {
  // ---------------------------------------------------------------- Auth
  register: async (payload: {
    nombre_completo: string;
    email: string;
    password: string;
    telefono?: string;
    direccion?: string;
  }): Promise<ApiResponse<{ user: User }>> => {
    const nombre = payload.nombre_completo.trim();
    const email = payload.email.trim().toLowerCase();
    if (!nombre || !email || !payload.password) {
      return fail('Nombre completo, correo y contraseña son obligatorios.');
    }
    try {
      await createUserWithEmailAndPassword(auth, email, payload.password);
      // El perfil (Puntos Eco de bienvenida y rol) lo crea el servidor, nunca el cliente.
      const res = await callFn<{ user: User }>('createProfile', {
        nombre_completo: nombre,
        telefono: payload.telefono ?? '',
        direccion: payload.direccion ?? '',
      });
      return ok({ user: res.user }, 'Registro exitoso. ¡Bienvenido a Café Vistro!');
    } catch (err) {
      return fail(errMessage(err, 'Ocurrió un error al procesar el registro.'));
    }
  },

  login: async (credentials: { email: string; password: string }): Promise<ApiResponse<{ user: User }>> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, credentials.email.trim().toLowerCase(), credentials.password);
      let user = await fetchProfile(cred.user.uid);
      if (!user) {
        // Cuenta de Auth sin perfil (registro interrumpido): se completa en el servidor.
        const res = await callFn<{ user: User }>('createProfile', {});
        user = res.user;
      }
      return ok({ user }, 'Inicio de sesión exitoso.');
    } catch (err) {
      return fail(errMessage(err, 'No se pudo iniciar sesión.'));
    }
  },

  logout: async (): Promise<ApiResponse<null>> => {
    try {
      await signOut(auth);
    } catch {
      /* ignore */
    }
    return ok(null, 'Sesión cerrada.');
  },

  getMe: async (): Promise<ApiResponse<{ user: User | null }>> => {
    try {
      await auth.authStateReady();
      const fbUser = auth.currentUser;
      if (!fbUser) return ok({ user: null });
      const user = await fetchProfile(fbUser.uid);
      return ok({ user });
    } catch {
      return ok({ user: null });
    }
  },

  // ----------------------------------------------------- Catálogo y contenido
  getProducts: async (): Promise<ApiResponse<Product[]>> => {
    try {
      const snap = await getDocs(query(collection(db, 'products'), where('activo', '==', true)));
      const products = snap.docs
        .map((d) => {
          const { activo, ...rest } = d.data();
          return rest as Product;
        })
        .sort((a, b) => a.id - b.id);
      return ok(products, 'Productos obtenidos exitosamente.');
    } catch {
      return fail<Product[]>('Error al obtener el catálogo de productos.');
    }
  },

  getBlog: async (): Promise<ApiResponse<BlogPost[]>> => {
    try {
      const snap = await getDocs(collection(db, 'blog_posts'));
      const posts = snap.docs.map((d) => d.data() as BlogPost).sort((a, b) => a.id - b.id);
      return ok(posts);
    } catch {
      return fail<BlogPost[]>('Error al obtener el blog.');
    }
  },

  getSucursales: async (): Promise<ApiResponse<Branch[]>> => {
    try {
      const snap = await getDocs(collection(db, 'sucursales'));
      const branches = snap.docs
        .map((d) => d.data() as Branch & { activo?: boolean })
        .filter((b) => b.activo !== false)
        .sort((a, b) => a.id - b.id);
      return ok(branches);
    } catch {
      return fail<Branch[]>('Error al obtener las sucursales.');
    }
  },

  // -------------------------------------------------------------- Cupones
  applyCoupon: async (
    code: string,
    items: CartPayloadItem[]
  ): Promise<
    ApiResponse<{
      code: string;
      tipo: 'percent' | 'fixed';
      valor: number;
      subtotal_server: number;
      descuento: number;
      total_con_cupon: number;
    }>
  > => {
    try {
      const res = await callFn<
        FnEnvelope<{
          code: string;
          tipo: 'percent' | 'fixed';
          valor: number;
          subtotal_server: number;
          descuento: number;
          total_con_cupon: number;
        }>
      >('applyCoupon', { code, items });
      return ok(res.data, res.message);
    } catch (err) {
      return fail(errMessage(err, 'Error al validar el cupón.'));
    }
  },

  // ------------------------------------------------------------- Wishlist
  getWishlist: async (): Promise<ApiResponse<number[]>> => {
    const uid = auth.currentUser?.uid;
    if (!uid) return fail<number[]>('Debes iniciar sesión.');
    try {
      const snap = await getDocs(collection(db, 'users', uid, 'wishlist'));
      return ok(snap.docs.map((d) => Number(d.id)).filter((n) => Number.isInteger(n)));
    } catch {
      return fail<number[]>('No se pudo cargar la lista de deseos.');
    }
  },

  toggleWishlist: async (
    producto_id: number
  ): Promise<ApiResponse<{ in_wishlist: boolean; producto_id: number }>> => {
    const uid = auth.currentUser?.uid;
    if (!uid) return fail('Debes iniciar sesión.');
    try {
      const ref = doc(db, 'users', uid, 'wishlist', String(producto_id));
      const snap = await getDoc(ref);
      if (snap.exists()) {
        await deleteDoc(ref);
        return ok({ in_wishlist: false, producto_id });
      }
      await setDoc(ref, { producto_id, created_at: serverTimestamp() });
      return ok({ in_wishlist: true, producto_id });
    } catch {
      return fail('No se pudo actualizar la lista de deseos.');
    }
  },

  // --------------------------------------------------------------- Pedidos
  createOrder: async (payload: {
    items: CartPayloadItem[];
    sucursal: string;
    cupon_codigo?: string;
    puntos_canjeados?: number;
    notas?: string;
  }): Promise<
    ApiResponse<{
      order_id: number;
      subtotal: number;
      descuento_cupon: number;
      descuento_puntos: number;
      total: number;
      puntos_ganados: number;
      puntos_canjeados: number;
      eco_points_balance: number;
      sucursal: string;
      items: any[];
    }>
  > => {
    try {
      const res = await callFn<
        FnEnvelope<{
          order_id: number;
          subtotal: number;
          descuento_cupon: number;
          descuento_puntos: number;
          total: number;
          puntos_ganados: number;
          puntos_canjeados: number;
          eco_points_balance: number;
          sucursal: string;
          items: any[];
        }>
      >('createOrder', payload);
      return ok(res.data, res.message);
    } catch (err) {
      return fail(errMessage(err, 'Error al procesar el pedido. No se realizó ningún cargo ni descuento de inventario.'));
    }
  },

  getOrders: async (all?: boolean): Promise<ApiResponse<Order[]>> => {
    const uid = auth.currentUser?.uid;
    if (!uid) return fail<Order[]>('Debes iniciar sesión.');
    try {
      const ordersCol = collection(db, 'orders');
      let docs;
      if (all) {
        try {
          // Solo funciona para administradores (lo exigen las reglas de Firestore).
          docs = (await getDocs(query(ordersCol, orderBy('id', 'desc')))).docs;
        } catch {
          docs = (await getDocs(query(ordersCol, where('usuario_id', '==', uid)))).docs;
        }
      } else {
        docs = (await getDocs(query(ordersCol, where('usuario_id', '==', uid)))).docs;
      }
      const orders = docs.map((d) => toOrder(d.data())).sort((a, b) => b.id - a.id);
      return ok(orders, 'Pedidos recuperados exitosamente.');
    } catch {
      return fail<Order[]>('Error al recuperar los pedidos.');
    }
  },
};
