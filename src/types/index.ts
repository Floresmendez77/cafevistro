export interface ProductVariant {
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
  value: number; // e.g. 15 for 15% or 50 for L. 50.00
  description: string;
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
  usuario_id: number;
  fecha_pedido: string;
  total: number;
  subtotal: number;
  descuento: number;
  descuento_cupon?: number;
  cupon_aplicado?: string;
  sucursal: string;
  estado: 'pendiente' | 'en proceso' | 'entregado';
  items: OrderItem[];
  puntos_ganados: number;
}

export interface User {
  id: number;
  nombre_completo: string;
  email: string;
  telefono: string;
  direccion: string;
  eco_points: number;
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
