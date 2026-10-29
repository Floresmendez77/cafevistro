/**
 * src/services/api.ts
 * Strongly-typed HTTP client with CSRF protection and session cookies.
 */

import { Product, BlogPost, Branch, Order, User } from '../types';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

let cachedCsrfToken: string | null = null;

export const getCachedCsrfToken = (): string | null => cachedCsrfToken;

export const setCachedCsrfToken = (token: string | null) => {
  cachedCsrfToken = token;
};

/**
 * Fetch or refresh CSRF token from the backend
 */
export async function fetchCsrfToken(): Promise<string> {
  try {
    const res = await fetch('/api/csrf.php', {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });
    const json: ApiResponse<{ csrf_token: string }> = await res.json();
    if (json.success && json.data?.csrf_token) {
      cachedCsrfToken = json.data.csrf_token;
      return cachedCsrfToken;
    }
  } catch (err) {
    console.warn('[API] Could not fetch CSRF token:', err);
  }
  return '';
}

/**
 * Core typed fetch wrapper
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const method = (options.method || 'GET').toUpperCase();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add JSON content-type if body is provided and not already specified
  if (options.body && typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Include CSRF token for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    if (!cachedCsrfToken) {
      await fetchCsrfToken();
    }
    if (cachedCsrfToken) {
      headers['X-CSRF-Token'] = cachedCsrfToken;
    }
  }

  const response = await fetch(endpoint, {
    ...options,
    method,
    headers,
    credentials: 'include', // Guarantees session cookie transmission
  });

  let data: ApiResponse<T>;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error(`Error de comunicación con el servidor (HTTP ${response.status})`);
  }

  // If new CSRF token returned in payload, update cache
  if (data?.data && typeof data.data === 'object' && 'csrf_token' in (data.data as any)) {
    const token = (data.data as any).csrf_token;
    if (token) cachedCsrfToken = token;
  }

  if (!response.ok && data && !data.success) {
    return data;
  }

  return data;
}

export const api = {
  // CSRF
  getCsrf: () => fetchCsrfToken(),

  // Auth
  register: (payload: {
    nombre_completo: string;
    email: string;
    password: string;
    telefono?: string;
    direccion?: string;
  }) =>
    request<{ user: User; csrf_token: string }>('/api/register.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (credentials: { email: string; password: string }) =>
    request<{ user: User; csrf_token: string }>('/api/login.php', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  logout: () =>
    request<null>('/api/logout.php', {
      method: 'POST',
    }),

  getMe: () =>
    request<{ user: User | null; csrf_token?: string }>('/api/me.php', {
      method: 'GET',
    }),

  // Catalog & Content
  getProducts: () => request<Product[]>('/api/get_products.php'),
  getBlog: () => request<BlogPost[]>('/api/get_blog.php'),
  getSucursales: () => request<Branch[]>('/api/get_sucursales.php'),

  // Coupons
  applyCoupon: (code: string, items: Array<{ productId: number; quantity: number; variantId?: number; nombre_variante?: string }>) =>
    request<{
      code: string;
      tipo: 'percent' | 'fixed';
      valor: number;
      subtotal_server: number;
      descuento: number;
      total_con_cupon: number;
    }>('/api/apply_coupon.php', {
      method: 'POST',
      body: JSON.stringify({ code, items }),
    }),

  // Wishlist
  getWishlist: () => request<number[]>('/api/get_wishlist.php'),
  toggleWishlist: (producto_id: number) =>
    request<{ in_wishlist: boolean; producto_id: number }>('/api/wishlist.php', {
      method: 'POST',
      body: JSON.stringify({ producto_id }),
    }),

  // Orders
  createOrder: (payload: {
    items: Array<{ productId: number; quantity: number; variantId?: number; nombre_variante?: string }>;
    sucursal: string;
    cupon_codigo?: string;
    puntos_canjeados?: number;
    notas?: string;
  }) =>
    request<{
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
    }>('/api/create_order.php', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getOrders: (all?: boolean) =>
    request<Order[]>(`/api/get_orders.php${all ? '?all=true' : ''}`),
};
