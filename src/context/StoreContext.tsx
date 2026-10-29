import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, ProductVariant, CartItem, Order, User, BlogPost, ToastMessage, Coupon } from '../types';
import { INITIAL_PRODUCTS, BLOG_POSTS } from '../data/initialData';
import { api } from '../services/api';

export const FREE_SHIPPING_THRESHOLD = 500.0;

interface StoreContextType {
  currentUser: User | null;
  isLoadingUser: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    password: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;

  products: Product[];
  isLoadingProducts: boolean;
  blogPosts: BlogPost[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity: number, variant?: ProductVariant) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  discountApplied: boolean;
  setDiscountApplied: (applied: boolean) => void;
  discountAmount: number;
  cartTotal: number;
  pickupLocation: string;
  setPickupLocation: (loc: string) => void;

  // Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  couponDiscount: number;
  freeShippingProgress: number;
  amountNeededForFreeShipping: number;

  // Wishlist
  wishlist: number[];
  toggleWishlist: (productId: number) => Promise<void>;

  // Orders
  orders: Order[];
  isLoadingOrders: boolean;
  createOrder: () => Promise<{ success: boolean; orderId?: number; message: string }>;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;
  refreshOrders: () => Promise<void>;

  // Theme & Navigation
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  activeSection: 'inicio' | 'catalogo' | 'espresso-bar' | 'mis-pedidos' | 'blog' | 'carrito';
  setActiveSection: (sec: 'inicio' | 'catalogo' | 'espresso-bar' | 'mis-pedidos' | 'blog' | 'carrito') => void;

  // Modals & Drawers
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  isLegalModalOpen: boolean;
  setIsLegalModalOpen: (open: boolean) => void;
  selectedBlogPost: BlogPost | null;
  setSelectedBlogPost: (post: BlogPost | null) => void;
  activeDetailProduct: Product | null;
  setActiveDetailProduct: (p: Product | null) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'info' | 'success' | 'error') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// 1 Point = L. 1.00 server-side
const POINTS_TO_LEMPIRAS = 1.0;

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state (persisted)
  const [theme, setThemeState] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });

  const setTheme = (t: 'dark' | 'light') => {
    setThemeState(t);
    localStorage.setItem('theme', t);
  };

  // Cart state (persisted)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cafe_vistro_cart') || localStorage.getItem('ecotienda_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // User state (SESSION ONLY - no passwords or sensitive user data in localStorage)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  // Catalog & Content states
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(BLOG_POSTS);

  // Orders & Wishlist
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Checkout states
  const [pickupLocation, setPickupLocation] = useState<string>('Mall Multiplaza');
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [serverCouponDiscount, setServerCouponDiscount] = useState<number>(0);

  const [activeSection, setActiveSection] = useState<'inicio' | 'catalogo' | 'espresso-bar' | 'mis-pedidos' | 'blog' | 'carrito'>('inicio');

  // Modals & Drawers state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState<boolean>(false);
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Cleanup old security risks from localStorage
  useEffect(() => {
    try {
      localStorage.removeItem('ecotienda_currentUser');
      localStorage.removeItem('ecotienda_registered_users');
      localStorage.removeItem('ecotienda_orders');
      localStorage.removeItem('ecotienda_wishlist');
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cafe_vistro_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Load orders & wishlist helper
  const loadUserData = useCallback(async () => {
    try {
      setIsLoadingOrders(true);
      const [wishlistRes, ordersRes] = await Promise.allSettled([
        api.getWishlist(),
        api.getOrders(),
      ]);

      if (wishlistRes.status === 'fulfilled' && wishlistRes.value.success && Array.isArray(wishlistRes.value.data)) {
        setWishlist(wishlistRes.value.data);
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value.success && Array.isArray(ordersRes.value.data)) {
        setOrders(ordersRes.value.data);
      }
    } catch (err) {
      console.warn('[StoreContext] Could not load user orders/wishlist:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // INITIAL BOOTSTRAP: Session check, Catalog, Blog
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        // 1. Check session
        const meRes = await api.getMe();
        if (isMounted) {
          if (meRes.success && meRes.data?.user) {
            setCurrentUser(meRes.data.user);
            loadUserData();
          } else {
            setCurrentUser(null);
          }
          setIsLoadingUser(false);
        }
      } catch (err) {
        if (isMounted) {
          setCurrentUser(null);
          setIsLoadingUser(false);
        }
      }

      // 2. Fetch catalog products from DB
      try {
        const prodRes = await api.getProducts();
        if (isMounted && prodRes.success && Array.isArray(prodRes.data) && prodRes.data.length > 0) {
          setProducts(prodRes.data);
        }
      } catch (err) {
        console.warn('[StoreContext] Using initial products fallback');
      } finally {
        if (isMounted) setIsLoadingProducts(false);
      }

      // 3. Fetch blog posts
      try {
        const blogRes = await api.getBlog();
        if (isMounted && blogRes.success && Array.isArray(blogRes.data) && blogRes.data.length > 0) {
          setBlogPosts(blogRes.data);
        }
      } catch (err) {
        console.warn('[StoreContext] Using initial blog posts fallback');
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [loadUserData]);

  // Auth: Login
  const login = async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.login({ email, password: pass });
      if (res.success && res.data?.user) {
        setCurrentUser(res.data.user);
        loadUserData();
        showToast(`¡Bienvenido de nuevo, ${res.data.user.nombre_completo.split(' ')[0]}!`, 'success');
        return { success: true, message: res.message };
      } else {
        const msg = res.message || 'Credenciales inválidas.';
        showToast(msg, 'error');
        return { success: false, message: msg };
      }
    } catch (err: any) {
      const msg = err?.message || 'Error de conexión con el servidor.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Auth: Register
  const register = async (userData: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.register({
        nombre_completo: userData.nombre,
        email: userData.email,
        password: userData.password,
        telefono: userData.telefono,
        direccion: userData.direccion,
      });

      if (res.success && res.data?.user) {
        setCurrentUser(res.data.user);
        showToast('¡Registro completado! Se han acreditado 50 Puntos Eco de bienvenida.', 'success');
        return { success: true, message: res.message };
      } else {
        const msg = res.message || 'Error al registrar la cuenta.';
        showToast(msg, 'error');
        return { success: false, message: msg };
      }
    } catch (err: any) {
      const msg = err?.message || 'Error al conectar con el servidor.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // Auth: Logout
  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // ignore
    } finally {
      setCurrentUser(null);
      setOrders([]);
      setWishlist([]);
      setCart([]);
      setDiscountApplied(false);
      setAppliedCoupon(null);
      showToast('Sesión cerrada correctamente. ¡Hasta pronto!', 'info');
    }
  };

  // Wishlist toggle
  const toggleWishlist = async (productId: number) => {
    if (!currentUser) {
      showToast('Inicia sesión para guardar productos en tu lista de deseos.', 'info');
      return;
    }

    try {
      const res = await api.toggleWishlist(productId);
      if (res.success && res.data) {
        if (res.data.in_wishlist) {
          setWishlist((prev) => [...prev, productId]);
          showToast('¡Producto agregado a tus favoritos!', 'success');
        } else {
          setWishlist((prev) => prev.filter((id) => id !== productId));
          showToast('Producto eliminado de favoritos.', 'info');
        }
      }
    } catch (err) {
      showToast('No se pudo actualizar la lista de deseos.', 'error');
    }
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number, variant?: ProductVariant) => {
    if (quantity <= 0) return;
    const additionalPrice = variant ? variant.precio_adicional : 0;
    const unitPrice = product.precio + additionalPrice;
    const itemId = `${product.id}-${variant ? variant.nombre_variante : 'base'}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: itemId,
            productId: product.id,
            nombre: variant ? `${product.nombre} (${variant.nombre_variante})` : product.nombre,
            imagen_url: product.imagen_url,
            selectedVariant: variant,
            unitPrice,
            quantity,
          },
        ];
      }
    });

    const itemLabel = variant ? `${product.nombre} (${variant.nombre_variante})` : product.nombre;
    showToast(`Se añadió "${itemLabel}" (x${quantity}) al carrito.`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Producto eliminado del carrito.', 'info');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setDiscountApplied(false);
    setAppliedCoupon(null);
    setServerCouponDiscount(0);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Free shipping calculations
  const freeShippingProgress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  // Points Discount calculation (1 point = L. 1.00)
  const userPoints = currentUser?.eco_points || 0;
  const potentialPointsDiscount = userPoints * POINTS_TO_LEMPIRAS;
  const maxPointsDiscount = Math.min(potentialPointsDiscount, cartSubtotal);
  const discountAmount = discountApplied ? Math.round(maxPointsDiscount * 100) / 100 : 0;

  // Coupon Discount
  const couponDiscount = appliedCoupon ? serverCouponDiscount : 0;
  const totalDiscount = Math.min(cartSubtotal, discountAmount + couponDiscount);
  const cartTotal = Math.max(0, cartSubtotal - totalDiscount);

  // Coupon operations with Server-side revalidation
  const applyCoupon = async (rawCode: string): Promise<{ success: boolean; message: string }> => {
    const cleanCode = rawCode.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Ingresa un código de cupón válido.' };
    }
    if (cart.length === 0) {
      showToast('Agrega productos al carrito antes de aplicar un cupón.', 'error');
      return { success: false, message: 'El carrito está vacío.' };
    }

    try {
      const itemsPayload = cart.map((c) => ({
        productId: c.productId,
        quantity: c.quantity,
        variantId: c.selectedVariant?.id,
        nombre_variante: c.selectedVariant?.nombre_variante,
      }));

      const res = await api.applyCoupon(cleanCode, itemsPayload);
      if (res.success && res.data) {
        setAppliedCoupon({
          code: res.data.code,
          type: res.data.tipo,
          value: res.data.valor,
          description: `Descuento ${res.data.tipo === 'percent' ? `${res.data.valor}%` : `L. ${res.data.valor}`}`,
        });
        setServerCouponDiscount(res.data.descuento);
        showToast(res.message, 'success');
        return { success: true, message: res.message };
      } else {
        showToast(res.message, 'error');
        return { success: false, message: res.message };
      }
    } catch (err: any) {
      const msg = err?.message || 'Error al validar el cupón.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setServerCouponDiscount(0);
    showToast('Cupón de descuento removido.', 'info');
  };

  // Orders operation via Real API
  const createOrder = async (): Promise<{ success: boolean; orderId?: number; message: string }> => {
    if (!currentUser) {
      showToast('Debes iniciar sesión para realizar un pedido.', 'error');
      return { success: false, message: 'Debes iniciar sesión para realizar un pedido.' };
    }
    if (cart.length === 0) {
      showToast('El carrito está vacío.', 'error');
      return { success: false, message: 'El carrito está vacío.' };
    }

    try {
      const itemsPayload = cart.map((c) => ({
        productId: c.productId,
        quantity: c.quantity,
        variantId: c.selectedVariant?.id,
        nombre_variante: c.selectedVariant?.nombre_variante,
      }));

      const payload = {
        items: itemsPayload,
        sucursal: pickupLocation,
        cupon_codigo: appliedCoupon ? appliedCoupon.code : undefined,
        puntos_canjeados: discountApplied ? Math.min(currentUser.eco_points, Math.floor(discountAmount)) : 0,
      };

      const res = await api.createOrder(payload);
      if (res.success && res.data) {
        const orderId = res.data.order_id;
        const newOrder: Order = {
          id: orderId,
          usuario_id: currentUser.id,
          fecha_pedido: new Date().toISOString().split('T')[0],
          total: res.data.total,
          subtotal: res.data.subtotal,
          descuento: res.data.descuento_cupon + res.data.descuento_puntos,
          descuento_cupon: res.data.descuento_cupon,
          cupon_aplicado: appliedCoupon?.code,
          sucursal: res.data.sucursal,
          estado: 'pendiente',
          puntos_ganados: res.data.puntos_ganados,
          puntos_canjeados: res.data.puntos_canjeados,
          items: cart.map((c) => ({
            id: c.productId,
            nombre: c.nombre,
            cantidad: c.quantity,
            precio_unitario: c.unitPrice,
            imagen_url: c.imagen_url,
            variante: c.selectedVariant?.nombre_variante,
          })),
        };

        setCurrentUser((prev) =>
          prev ? { ...prev, eco_points: res.data.eco_points_balance } : null
        );
        setOrders((prev) => [newOrder, ...prev]);
        setLastCreatedOrder(newOrder);
        clearCart();

        showToast(`¡Pedido #${orderId} confirmado! Tu café se está preparando.`, 'success');
        return {
          success: true,
          orderId,
          message: res.message,
        };
      } else {
        const msg = res.message || 'Error al procesar el pedido.';
        showToast(msg, 'error');
        return { success: false, message: msg };
      }
    } catch (err: any) {
      const msg = err?.message || 'Error al conectar con el servidor para registrar el pedido.';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const refreshOrders = async () => {
    if (!currentUser) return;
    try {
      const res = await api.getOrders();
      if (res.success && Array.isArray(res.data)) {
        setOrders(res.data);
      }
    } catch (e) {
      // ignore
    }
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        isLoadingUser,
        login,
        register,
        logout,
        products,
        isLoadingProducts,
        blogPosts,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        discountApplied,
        setDiscountApplied,
        discountAmount,
        cartTotal,
        pickupLocation,
        setPickupLocation,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponDiscount,
        freeShippingProgress,
        amountNeededForFreeShipping,
        wishlist,
        toggleWishlist,
        orders,
        isLoadingOrders,
        createOrder,
        lastCreatedOrder,
        setLastCreatedOrder,
        refreshOrders,
        theme,
        setTheme,
        activeSection,
        setActiveSection,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        isLegalModalOpen,
        setIsLegalModalOpen,
        selectedBlogPost,
        setSelectedBlogPost,
        activeDetailProduct,
        setActiveDetailProduct,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
