export interface ProductVariant {
  id?: number;
  nombre_variante: string;
  precio_adicional: number;
}

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagen_url: string;
  gallery?: string[];
  categoria: string;
  variantes?: ProductVariant[];
  eco_impact?: string;
  fecha_ingreso?: string;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  description?: string;
  minPurchase?: number;
}

export interface CartItem {
  id: string; // unique key combining product id and variant
  productId: number;
  nombre: string;
  imagen_url: string;
  selectedVariant?: ProductVariant;
  unitPrice: number;
  quantity: number;
}

export interface OrderItem {
  id: number;
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  imagen_url?: string;
  variante?: string;
}

export interface Order {
  id: number;
  usuario_id: number | string;
  fecha_pedido: string;
  total: number;
  subtotal: number;
  descuento: number;
  descuento_cupon?: number;
  cupon_aplicado?: string;
  sucursal: string;
  estado: 'pendiente' | 'en proceso' | 'en_proceso' | 'entregado' | 'cancelado';
  items: OrderItem[];
  puntos_ganados: number;
  puntos_canjeados?: number;
  cliente_nombre?: string;
  cliente_email?: string;
}

export interface User {
  id: number | string;
  nombre_completo: string;
  email: string;
  telefono: string;
  direccion: string;
  eco_points: number;
  role?: 'cliente' | 'admin';
}

export interface Branch {
  id: number;
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono?: string;
  horario?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  content: string;
  resumen?: string;
  tag: string;
  readTime: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'error';
}
