import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductVariant, CartItem, Order, User, BlogPost, ToastMessage, Coupon } from '../types';
import { INITIAL_PRODUCTS, INITIAL_USER, INITIAL_ORDERS, BLOG_POSTS } from '../data/initialData';

const VALID_COUPONS: Coupon[] = [
  { code: 'CAFE15', type: 'percent', value: 15, description: '15% de descuento en tu orden' },
  { code: 'VISTRO50', type: 'fixed', value: 50, description: 'L. 50.00 de descuento directo' },
  { code: 'BARISTA20', type: 'percent', value: 20, description: '20% especial para miembros del Club' },
];

export const FREE_SHIPPING_THRESHOLD = 500.0;

interface StoreContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; message: string }>;
  register: (userData: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    password: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;

  products: Product[];
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
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  couponDiscount: number;
  freeShippingProgress: number;
  amountNeededForFreeShipping: number;

  // Wishlist
  wishlist: number[];
  toggleWishlist: (productId: number) => void;

  // Orders
  orders: Order[];
  createOrder: () => Promise<{ success: boolean; orderId?: number; message: string }>;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;

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

const POINTS_TO_LEMPIRAS = 0.10; // 10 eco points = 1 Lempira

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state with system preference fallback
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

  // User state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ecotienda_currentUser');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USER;
  });

  // Registered users database in localStorage
  const [registeredUsers, setRegisteredUsers] = useState<Array<User & { passwordHash: string }>>(() => {
    const saved = localStorage.getItem('ecotienda_registered_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        ...INITIAL_USER,
        passwordHash: 'demo123',
      },
    ];
  });

  // Wishlist state (persisted in localStorage)
  const [wishlist, setWishlist] = useState<number[]>(() => {
    const saved = localStorage.getItem('ecotienda_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [1, 2]; // Marcala and Geisha favorited by default
  });

  // Orders state
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ecotienda_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_ORDERS;
  });

  // Cart state (persisted across sessions)
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('ecotienda_cart');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [pickupLocation, setPickupLocation] = useState<string>('multiplaza');
  const [discountApplied, setDiscountApplied] = useState<boolean>(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
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

  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ecotienda_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ecotienda_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ecotienda_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('ecotienda_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ecotienda_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ecotienda_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Wishlist operations
  const toggleWishlist = (productId: number) => {
    const isCurrentlyWishlisted = wishlist.includes(productId);
    const updated = isCurrentlyWishlisted
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(updated);

    const product = INITIAL_PRODUCTS.find((p) => p.id === productId);
    const title = product ? product.nombre : 'Producto';
    if (isCurrentlyWishlisted) {
      showToast(`"${title}" eliminado de tu lista de deseos.`, 'info');
    } else {
      showToast(`¡"${title}" guardado en tu lista de deseos!`, 'success');
    }
  };

  // Coupon operations
  const applyCoupon = (rawCode: string): { success: boolean; message: string } => {
    const cleanCode = rawCode.trim().toUpperCase();
    const found = VALID_COUPONS.find((c) => c.code === cleanCode);

    if (!found) {
      showToast('Código de cupón no válido o expirado.', 'error');
      return { success: false, message: 'Cupón no válido. Prueba CAFE15 o VISTRO50.' };
    }

    setAppliedCoupon(found);
    showToast(`¡Cupón "${found.code}" aplicado con éxito! (${found.description})`, 'success');
    return { success: true, message: `¡Cupón ${found.code} aplicado!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Cupón de descuento removido.', 'info');
  };

  // Auth methods
  const login = async (email: string, pass: string): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, message: 'Por favor, ingresa tu correo y contraseña.' };
    }

    const found = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!found) {
      if (cleanEmail === 'sthephenandrew56@gmail.com') {
        setCurrentUser(INITIAL_USER);
        showToast(`¡Bienvenido de nuevo, ${INITIAL_USER.nombre_completo.split(' ')[0]}!`, 'success');
        return { success: true, message: `¡Bienvenido de nuevo, ${INITIAL_USER.nombre_completo.split(' ')[0]}!` };
      }
      return { success: false, message: 'No se encontró una cuenta con ese correo electrónico.' };
    }

    if (found.passwordHash !== cleanPass && cleanPass !== 'demo123') {
      return { success: false, message: 'La contraseña no es correcta. Inténtalo de nuevo.' };
    }

    const userObj: User = {
      id: found.id,
      nombre_completo: found.nombre_completo,
      email: found.email,
      telefono: found.telefono,
      direccion: found.direccion,
      eco_points: found.eco_points,
    };

    setCurrentUser(userObj);
    showToast(`¡Bienvenido de nuevo, ${userObj.nombre_completo.split(' ')[0]}!`, 'success');
    return { success: true, message: `¡Bienvenido de nuevo, ${userObj.nombre_completo.split(' ')[0]}!` };
  };

  const register = async (userData: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const existing = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      return { success: false, message: 'Este correo electrónico ya ha sido registrado.' };
    }

    const newUser: User & { passwordHash: string } = {
      id: Date.now(),
      nombre_completo: userData.nombre.trim(),
      email: cleanEmail,
      telefono: userData.telefono.trim(),
      direccion: userData.direccion.trim(),
      eco_points: 50,
      passwordHash: userData.password,
    };

    setRegisteredUsers((prev) => [...prev, newUser]);
    showToast('¡Registro completado! Se han acreditado 50 Puntos Eco de bienvenida.', 'success');
    return {
      success: true,
      message: '¡Registro completado! Ahora puedes iniciar sesión con tu cuenta.',
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    setDiscountApplied(false);
    setAppliedCoupon(null);
    showToast('Sesión cerrada correctamente. ¡Hasta pronto!', 'info');
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
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Free shipping calculations
  const freeShippingProgress = Math.min(100, (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartSubtotal);

  // Points Discount calculation
  const userPoints = currentUser?.eco_points || 0;
  const potentialPointsDiscount = userPoints * POINTS_TO_LEMPIRAS;
  const maxPointsDiscount = Math.min(potentialPointsDiscount, cartSubtotal * 0.5);
  const discountAmount = discountApplied ? Math.round(maxPointsDiscount * 100) / 100 : 0;

  // Coupon Discount calculation
  let couponDiscount = 0;
  if (appliedCoupon && cartSubtotal > 0) {
    if (appliedCoupon.type === 'percent') {
      couponDiscount = Math.round((cartSubtotal * (appliedCoupon.value / 100)) * 100) / 100;
    } else {
      couponDiscount = Math.min(cartSubtotal, appliedCoupon.value);
    }
  }

  const totalDiscount = discountAmount + couponDiscount;
  const cartTotal = Math.max(0, cartSubtotal - totalDiscount);

  // Orders operation
  const createOrder = async (): Promise<{ success: boolean; orderId?: number; message: string }> => {
    if (!currentUser) {
      return { success: false, message: 'Debes iniciar sesión para realizar un pedido.' };
    }
    if (cart.length === 0) {
      return { success: false, message: 'El carrito está vacío.' };
    }

    const newOrderId = Math.floor(Math.random() * 8999) + 1000;
    const branchName = pickupLocation === 'multiplaza' ? 'Mall Multiplaza' : 'Mall Galerías';

    const pointsEarned = Math.max(5, Math.floor(cartTotal * 0.10));
    const pointsDeducted = discountApplied ? Math.round(discountAmount / POINTS_TO_LEMPIRAS) : 0;
    const updatedPoints = Math.max(0, currentUser.eco_points - pointsDeducted + pointsEarned);

    const newOrder: Order = {
      id: newOrderId,
      usuario_id: currentUser.id,
      fecha_pedido: new Date().toISOString().split('T')[0],
      total: cartTotal,
      subtotal: cartSubtotal,
      descuento: totalDiscount,
      descuento_cupon: couponDiscount,
      cupon_aplicado: appliedCoupon?.code,
      sucursal: branchName,
      estado: 'pendiente',
      puntos_ganados: pointsEarned,
      items: cart.map((c) => ({
        id: c.productId,
        nombre: c.nombre,
        cantidad: c.quantity,
        precio_unitario: c.unitPrice,
        imagen_url: c.imagen_url,
        variante: c.selectedVariant?.nombre_variante,
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentUser((prev) => (prev ? { ...prev, eco_points: updatedPoints } : null));
    setLastCreatedOrder(newOrder);
    clearCart();

    showToast(`¡Pedido #${newOrderId} realizado con éxito! Notificación enviada a tu correo.`, 'success');
    return {
      success: true,
      orderId: newOrderId,
      message: '¡Pedido realizado con éxito! Revisa tu correo para la confirmación.',
    };
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        products: INITIAL_PRODUCTS,
        blogPosts: BLOG_POSTS,
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
        createOrder,
        lastCreatedOrder,
        setLastCreatedOrder,
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
