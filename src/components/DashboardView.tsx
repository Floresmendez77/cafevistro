import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductVariant } from '../types';
import { HeroSection } from './HeroSection';
import { EcoImpactSection } from './EcoImpactSection';
import { InteractiveEspressoBar } from './InteractiveEspressoBar';
import { Footer } from './Footer';
import { formatLempiras } from '../utils/formatCurrency';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    logout,
    products,
    blogPosts,
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal,
    discountApplied,
    setDiscountApplied,
    discountAmount,
    appliedCoupon,
    couponDiscount,
    cartTotal,
    pickupLocation,
    setPickupLocation,
    wishlist,
    toggleWishlist,
    orders,
    createOrder,
    activeSection,
    setActiveSection,
    setIsLegalModalOpen,
    setSelectedBlogPost,
    setIsSettingsModalOpen,
    setIsCartDrawerOpen,
    setActiveDetailProduct,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize state from URL Search Params for shareable links
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('cat') || 'Todos';
    }
    return 'Todos';
  });

  const [searchQuery, setSearchQuery] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('search') || '';
    }
    return '';
  });

  const [debouncedSearch, setDebouncedSearch] = useState<string>(searchQuery);

  const [sortOption, setSortOption] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('sort') || 'relevancia';
    }
    return 'relevancia';
  });

  const [filterWishlistOnly, setFilterWishlistOnly] = useState<boolean>(false);

  // 300ms Debounce effect on search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync state to URL Query Params (shareable filters)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      if (selectedCategory !== 'Todos') params.set('cat', selectedCategory);
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (sortOption !== 'relevancia') params.set('sort', sortOption);

      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [selectedCategory, debouncedSearch, sortOption]);

  // Selected variant per product (product id -> ProductVariant)
  const [selectedVariants, setSelectedVariants] = useState<Record<number, ProductVariant>>({});
  // Quantity selector per product (product id -> number)
  const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});
  // Added to cart feedback state for checkmark morph (product id -> boolean)
  const [addedFeedback, setAddedFeedback] = useState<Record<number, boolean>>({});

  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);

  const handleVariantChange = (productId: number, variant: ProductVariant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant,
    }));
  };

  const handleQuantityChange = (productId: number, delta: number) => {
    const current = productQuantities[productId] || 1;
    const next = Math.max(1, current + delta);
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: next,
    }));
  };

  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const qty = productQuantities[product.id] || 1;
    const variant = selectedVariants[product.id] || (product.variantes ? product.variantes[0] : undefined);
    addToCart(product, qty, variant);

    setAddedFeedback((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedFeedback((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleCategorySelect = (cat: string) => {
    if (cat === selectedCategory) return;
    setIsLoadingCatalog(true);
    setSelectedCategory(cat);
    setTimeout(() => {
      setIsLoadingCatalog(false);
    }, 250);
  };

  const handleCheckout = async () => {
    setIsSubmittingOrder(true);
    try {
      await createOrder();
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.categoria)))];

  // Filtering & Sorting
  let filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Todos' || p.categoria === selectedCategory;
    const matchesSearch =
      p.nombre.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesWishlist = !filterWishlistOnly || wishlist.includes(p.id);
    return matchesCategory && matchesSearch && matchesWishlist;
  });

  if (sortOption === 'precio-asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.precio - b.precio);
  } else if (sortOption === 'precio-desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.precio - a.precio);
  } else if (sortOption === 'stock') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.stock - a.stock);
  }

  const firstName = currentUser?.nombre_completo.split(' ')[0] || 'Amigo';

  return (
    <div className="dashboard-container relative min-h-screen flex bg-gradient-to-b from-[#140B07] via-[#20140D] to-[#2B1A12] text-[#F8F1E9] font-sans overflow-x-hidden">
      {/* Defocused Background Orbs for Parallax Glass Depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="orb-animate-1 absolute top-10 left-[10%] w-[32rem] h-[32rem] rounded-full bg-gradient-to-tr from-[#B89778]/18 via-amber-600/15 to-transparent blur-[110px]" />
        <div className="orb-animate-2 absolute bottom-20 right-[5%] w-[38rem] h-[38rem] rounded-full bg-gradient-to-bl from-orange-950/30 via-[#B89778]/15 to-amber-700/20 blur-[130px]" />
        <div className="absolute top-[45%] right-[30%] w-80 h-80 rounded-full bg-amber-500/10 blur-[90px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:28px_28px] opacity-30" />
      </div>

      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        id="sidebar-nav"
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[#F8F1E9] text-[#2A1C15] flex flex-col p-6 z-40 shadow-2xl transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="sidebar-header flex items-center mb-8 pb-4 border-b border-[#8B7B6E]/30">
          <img
            src="/cafe_vistro_logo.jpg"
            alt="Café Vistro Logo"
            className="h-12 w-12 object-cover mr-3 rounded-full border border-[#B89778]/60 shadow-md"
          />
          <div>
            <h2 className="brand-name font-serif text-2xl font-bold tracking-tight text-[#2A1C15]">
              Café Vistro<span className="text-[#B89778]">.</span>
            </h2>
            <span className="text-[10px] uppercase tracking-wider text-[#8B7B6E] font-bold block">
              Specialty Coffee HN
            </span>
          </div>
        </div>

        {/* User preview badge */}
        <div className="mb-6 p-3 rounded-xl bg-black/5 border border-black/10 flex items-center justify-between text-xs">
          <div className="truncate">
            <span className="font-bold text-[#2A1C15] block truncate">{currentUser?.nombre_completo}</span>
            <span className="text-[#8B7B6E] text-[11px] truncate block">{currentUser?.email}</span>
          </div>
          <div className="text-right shrink-0 ml-2">
            <span className="bg-[#B89778]/20 text-[#2A1C15] font-black px-2 py-0.5 rounded-full text-[11px] border border-[#B89778]/30">
              <i className="fas fa-leaf text-[#B89778] mr-1"></i> {currentUser?.eco_points || 0} pts
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav flex flex-col gap-2 flex-grow">
          <button
            onClick={() => {
              setActiveSection('inicio');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3.5 p-3 rounded-xl font-bold text-sm transition-all text-left ${
              activeSection === 'inicio'
                ? 'bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] shadow-md'
                : 'text-[#4A372E] hover:bg-black/5 hover:translate-x-1'
            }`}
          >
            <i className="fas fa-home-alt w-5 text-center text-base"></i>
            <span>Inicio</span>
          </button>

          <button
            onClick={() => {
              setActiveSection('catalogo');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3.5 p-3 rounded-xl font-bold text-sm transition-all text-left ${
              activeSection === 'catalogo'
                ? 'bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] shadow-md'
                : 'text-[#4A372E] hover:bg-black/5 hover:translate-x-1'
            }`}
          >
            <i className="fas fa-store w-5 text-center text-base"></i>
            <span>Catálogo de Café</span>
          </button>

          <button
            onClick={() => {
              setActiveSection('espresso-bar');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3.5 p-3 rounded-xl font-bold text-sm transition-all text-left ${
              activeSection === 'espresso-bar'
                ? 'bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] shadow-md'
                : 'text-[#4A372E] hover:bg-black/5 hover:translate-x-1'
            }`}
          >
            <i className="fas fa-mug-hot w-5 text-center text-base"></i>
            <span>Barra Espresso (Glass)</span>
            <span className="ml-auto text-[9px] uppercase tracking-wider bg-amber-500/20 text-[#2A1C15] border border-amber-600/30 px-1.5 py-0.5 rounded-full font-black">
              PRO
            </span>
          </button>

          <button
            onClick={() => {
              setSelectedCategory('Repostería de Autor');
              setFilterWishlistOnly(false);
              setActiveSection('catalogo');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3.5 p-3 rounded-xl font-bold text-sm transition-all text-left ${
              activeSection === 'catalogo' && selectedCategory === 'Repostería de Autor'
                ? 'bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] shadow-md'
                : 'text-[#4A372E] hover:bg-black/5 hover:translate-x-1'
            }`}
          >
            <i className="fas fa-cookie-bite w-5 text-center text-base"></i>
            <span>Repostería de Autor</span>
            <span className="ml-auto text-[9px] uppercase tracking-wider bg-rose-500/20 text-[#2A1C15] border border-rose-600/30 px-1.5 py-0.5 rounded-full font-black">
              TOP
            </span>
          </button>

          <button
            onClick={() => {
              setActiveSection('mis-pedidos');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3.5 p-3 rounded-xl font-bold text-sm transition-all text-left ${
              activeSection === 'mis-pedidos'
                ? 'bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] shadow-md'
                : 'text-[#4A372E] hover:bg-black/5 hover:translate-x-1'
            }`}
          >
            <i className="fas fa-receipt w-5 text-center text-base"></i>
            <span>Mis Pedidos</span>
            {orders.length > 0 && (
              <span className="ml-auto bg-black/10 text-xs px-2 py-0.5 rounded-full font-bold">
                {orders.length}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveSection('blog');
              setMobileMenuOpen(false);
            }}
            className={`flex items-center gap-3.5 p-3 rounded-xl font-bold text-sm transition-all text-left ${
              activeSection === 'blog'
                ? 'bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] shadow-md'
                : 'text-[#4A372E] hover:bg-black/5 hover:translate-x-1'
            }`}
          >
            <i className="fas fa-book-open w-5 text-center text-base"></i>
            <span>Guía de Extracción</span>
          </button>

          <button
            onClick={() => {
              setIsLegalModalOpen(true);
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3.5 p-3 rounded-xl font-bold text-sm transition-all text-left text-[#4A372E] hover:bg-black/5 hover:translate-x-1"
          >
            <i className="fas fa-gavel w-5 text-center text-base"></i>
            <span>Políticas y Legal</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer pt-4 border-t border-[#8B7B6E]/30 space-y-2">
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold text-[#4A372E] hover:bg-black/5 transition-all text-left"
          >
            <i className="fas fa-cog w-4 text-center"></i>
            <span>Ajustes de Tema</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 transition-all text-left"
          >
            <i className="fas fa-sign-out-alt w-4 text-center"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main-content flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto min-h-screen flex flex-col justify-between">
        <div>
          {/* Main Header */}
          <header className="main-header flex items-center justify-between pb-6 mb-8 border-b border-[rgba(184,151,120,0.25)]">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-[#382820] text-[#B89778] text-lg hover:bg-[#B89778] hover:text-[#2A1C15] transition-all"
                aria-label="Abrir menú"
              >
                <i className="fas fa-bars"></i>
              </button>
              <div>
                <h1 id="welcome-message" className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-[#F8F1E9]">
                  ¡Hola, {firstName}!
                </h1>
                <p className="text-xs md:text-sm text-[#D4B99F]">
                  Club Barista • Café Vistro Specialty Roasters
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Wishlist Shortcut Pill */}
              <button
                onClick={() => {
                  setActiveSection('catalogo');
                  setFilterWishlistOnly(!filterWishlistOnly);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  filterWishlistOnly
                    ? 'bg-red-500/20 text-red-300 border-red-500/50'
                    : 'bg-[#382820] text-[#D4B99F] border-[rgba(184,151,120,0.3)] hover:text-red-400'
                }`}
                title="Ver lista de deseos"
              >
                <i className="fas fa-heart text-red-400"></i>
                <span className="hidden sm:inline">Deseos</span>
                <span className="text-[11px] bg-black/40 px-1.5 py-0.2 rounded-full">
                  {wishlist.length}
                </span>
              </button>

              {/* Quick Cart Drawer Trigger with animated badge */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-3 rounded-xl bg-[#382820] text-[#B89778] hover:bg-[#B89778] hover:text-[#2A1C15] border border-[rgba(184,151,120,0.3)] shadow-md transition-all cursor-pointer group"
                title="Abrir Carrito"
              >
                <i className="fas fa-shopping-bag text-lg group-hover:scale-110 transition-transform"></i>
                <span
                  id="cart-count"
                  className={`absolute -top-2 -right-2 bg-[#B89778] text-[#2A1C15] font-black text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#2A1C15] shadow-md ${
                    cartCount > 0 ? 'animate-badge-pop' : ''
                  }`}
                >
                  {cartCount}
                </span>
              </button>
            </div>
          </header>

          {/* SECTION: INICIO */}
          {activeSection === 'inicio' && (
            <section className="space-y-12 animate-fade-in" id="inicio">
              <HeroSection />

              {/* BARRA DE ESPRESSO INTERACTIVA (GLASSMORPHISM) */}
              <InteractiveEspressoBar />

              {/* REPOSTERÍA DE AUTOR & MARIDAJE SHOWCASE */}
              <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl">
                {/* Background ambient warm light */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 relative z-10">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold mb-2">
                      <i className="fas fa-cookie-bite text-rose-400"></i> Repostería & Cocina Dulce
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
                      Repostería de Autor al Espresso
                    </h3>
                    <p className="text-xs sm:text-sm text-[#D4B99F] mt-1 max-w-xl">
                      Elaborada artesanalmente cada mañana con café de estricta altura, mantequilla pura y cacao fino de Honduras.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategory('Repostería de Autor');
                      setActiveSection('catalogo');
                    }}
                    className="shrink-0 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#F8F1E9] border border-white/15 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Explorar Toda la Carta Dulce</span>
                    <i className="fas fa-arrow-right text-xs"></i>
                  </button>
                </div>

                {/* Grid of Pastries */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                  {products
                    .filter((p) => p.categoria === 'Repostería de Autor')
                    .slice(0, 4)
                    .map((pastry) => (
                      <div
                        key={pastry.id}
                        onClick={() => setActiveDetailProduct(pastry)}
                        className="glass-card rounded-2xl overflow-hidden border border-white/10 hover:border-[#B89778]/50 transition-all duration-300 hover:-translate-y-1 group cursor-pointer flex flex-col justify-between"
                      >
                        <div className="relative h-44 overflow-hidden bg-black/40">
                          <img
                            src={pastry.imagen_url}
                            alt={pastry.nombre}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-2.5 right-2.5 bg-[#1C120C]/80 backdrop-blur-md text-[#EED5B8] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-white/10">
                            {formatLempiras(pastry.precio)}
                          </span>
                        </div>
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif font-bold text-sm text-white line-clamp-1 group-hover:text-[#B89778] transition-colors">
                              {pastry.nombre}
                            </h4>
                            <p className="text-xs text-[#D4B99F]/80 line-clamp-2 mt-1 leading-relaxed">
                              {pastry.descripcion}
                            </p>
                          </div>
                          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                              <i className="fas fa-leaf text-[9px]"></i> 100% Fresco
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(pastry, e);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#B89778] hover:bg-[#D4B99F] text-[#1E130D] text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <i className="fas fa-plus text-[10px]"></i>
                              <span>Añadir</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* STATS GRID */}
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F8F1E9] mb-6 flex items-center gap-3">
                  <i className="fas fa-chart-line text-[#B89778]"></i> Resumen de tu Perfil
                </h2>

                <div className="stats-grid grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="stat-card bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl text-center hover:-translate-y-1 transition-transform">
                    <h3 className="text-sm font-semibold text-[#8B7B6E] flex items-center justify-center gap-2 mb-2">
                      <i className="fas fa-box text-[#B89778]"></i> Pedidos Realizados
                    </h3>
                    <p className="font-serif text-3xl md:text-4xl font-bold text-[#B89778]">
                      {orders.length}
                    </p>
                  </div>

                  <div className="stat-card bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl text-center hover:-translate-y-1 transition-transform">
                    <h3 className="text-sm font-semibold text-[#8B7B6E] flex items-center justify-center gap-2 mb-2">
                      <i className="fas fa-leaf text-[#B89778]"></i> Puntos Eco Acumulados
                    </h3>
                    <p className="font-serif text-3xl md:text-4xl font-bold text-[#B89778]">
                      {currentUser?.eco_points || 0}
                    </p>
                  </div>

                  <div className="stat-card bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl text-center hover:-translate-y-1 transition-transform">
                    <h3 className="text-sm font-semibold text-[#8B7B6E] flex items-center justify-center gap-2 mb-2">
                      <i className="fas fa-coffee text-[#B89778]"></i> Variedades en Catálogo
                    </h3>
                    <p className="font-serif text-3xl md:text-4xl font-bold text-[#B89778]">
                      {products.length}
                    </p>
                  </div>
                </div>
              </div>

              <EcoImpactSection />

              {/* EXPERIENCIA DE COMPRA */}
              <div>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-[#F8F1E9] mb-4">
                  Experiencia de Compra Sostenible
                </h3>
                <div className="process-container grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="process-step bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl hover:-translate-y-1 transition-transform text-center md:text-left">
                    <div className="w-10 h-10 rounded-full bg-[#B89778]/20 text-[#B89778] font-serif font-bold text-lg flex items-center justify-center mb-3 mx-auto md:mx-0">
                      1
                    </div>
                    <h4 className="font-serif font-bold text-lg text-[#B89778] mb-2">
                      Elige tu Tueste y Molienda
                    </h4>
                    <p className="text-xs sm:text-sm text-[#F8F1E9]/90 leading-relaxed">
                      Selecciona granos enteros para moler en casa o con molienda exacta para V60, espresso o prensa francesa.
                    </p>
                  </div>

                  <div className="process-step bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl hover:-translate-y-1 transition-transform text-center md:text-left">
                    <div className="w-10 h-10 rounded-full bg-[#B89778]/20 text-[#B89778] font-serif font-bold text-lg flex items-center justify-center mb-3 mx-auto md:mx-0">
                      2
                    </div>
                    <h4 className="font-serif font-bold text-lg text-[#B89778] mb-2">
                      Canjea Puntos y Cupones
                    </h4>
                    <p className="text-xs sm:text-sm text-[#F8F1E9]/90 leading-relaxed">
                      Aplica tus Puntos Eco o cupones como CAFE15 y aprovecha envío gratis en compras mayores a L. 500.00.
                    </p>
                  </div>

                  <div className="process-step bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl hover:-translate-y-1 transition-transform text-center md:text-left">
                    <div className="w-10 h-10 rounded-full bg-[#B89778]/20 text-[#B89778] font-serif font-bold text-lg flex items-center justify-center mb-3 mx-auto md:mx-0">
                      3
                    </div>
                    <h4 className="font-serif font-bold text-lg text-[#B89778] mb-2">
                      Tostado Fresco a tu Taza
                    </h4>
                    <p className="text-xs sm:text-sm text-[#F8F1E9]/90 leading-relaxed">
                      Despachamos café con menos de 72 horas de tueste para garantizar notas aromáticas plenas y crema densa.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SECTION: CATÁLOGO */}
          {activeSection === 'catalogo' && (
            <section className="space-y-8 animate-fade-in" id="catalogo">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F8F1E9] flex items-center gap-3">
                    <i className="fas fa-coffee text-[#B89778]"></i> Catálogo de Especialidad
                  </h2>
                  <p className="text-xs md:text-sm text-[#D4B99F] mt-1">
                    Granos de altura, métodos de goteo manuales y herramientas de barista profesional
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Live Search bar with debounce */}
                  <div className="relative w-full sm:w-64">
                    <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8B7B6E]"></i>
                    <input
                      type="text"
                      placeholder="Buscar café o métodos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#382820] text-xs text-[#F8F1E9] border border-[rgba(184,151,120,0.3)] focus:border-[#B89778] outline-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8B7B6E] hover:text-[#F8F1E9]"
                      >
                        &times;
                      </button>
                    )}
                  </div>

                  {/* Sort Selector Dropdown */}
                  <div className="relative">
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-[#382820] text-xs text-[#F8F1E9] border border-[rgba(184,151,120,0.3)] focus:border-[#B89778] outline-none cursor-pointer"
                    >
                      <option value="relevancia">Ordenar por: Relevancia</option>
                      <option value="precio-asc">Precio: Menor a Mayor</option>
                      <option value="precio-desc">Precio: Mayor a Menor</option>
                      <option value="stock">Mayor Disponibilidad</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Glassmorphic Espresso Bar Banner */}
              <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-white/15 flex flex-col md:flex-row items-center justify-between gap-5 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#EED5B8] text-[11px] font-mono font-bold mb-2 border border-white/15">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Estación de Espresso en Vivo
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                    ¿Deseas una extracción personalizada al momento?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#D4B99F] mt-1 max-w-xl leading-relaxed">
                    Personaliza shots, texturizado de leche barista, temperatura y aromas con nuestra visualización de capas en vaso de vidrio.
                  </p>
                </div>
                <button
                  onClick={() => setActiveSection('espresso-bar')}
                  className="shrink-0 relative z-10 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#D4B99F] via-[#B89778] to-[#997354] text-[#1E130D] font-serif font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(184,151,120,0.5)] hover:scale-105 transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <i className="fas fa-mug-hot text-base"></i>
                  <span>Abrir Barra Espresso</span>
                </button>
              </div>

              {/* Category filter pills & Wishlist filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setFilterWishlistOnly(false);
                      handleCategorySelect(cat);
                    }}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                      selectedCategory === cat && !filterWishlistOnly
                        ? 'bg-[#B89778] text-[#2A1C15] shadow-md font-bold'
                        : 'bg-[#382820] text-[#D4B99F] hover:bg-[#B89778]/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}

                {/* Wishlist toggle chip */}
                <button
                  onClick={() => setFilterWishlistOnly(!filterWishlistOnly)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    filterWishlistOnly
                      ? 'bg-red-500 text-white shadow-md font-bold'
                      : 'bg-[#382820] text-[#D4B99F] hover:bg-red-500/20'
                  }`}
                >
                  <i className="fas fa-heart text-xs"></i>
                  <span>Solo Favoritos ({wishlist.length})</span>
                </button>
              </div>

              {/* Skeleton loading preview while switching category or sorting */}
              {isLoadingCatalog ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((sk) => (
                    <div key={sk} className="h-80 rounded-2xl skeleton-shimmer border border-[rgba(184,151,120,0.2)]" />
                  ))}
                </div>
              ) : (
                <div className="product-grid-detailed grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => {
                    const activeVariant = selectedVariants[product.id] || (product.variantes ? product.variantes[0] : undefined);
                    const unitPrice = product.precio + (activeVariant ? activeVariant.precio_adicional : 0);
                    const isAdded = !!addedFeedback[product.id];
                    const isWishlisted = wishlist.includes(product.id);

                    return (
                      <div
                        key={product.id}
                        className="product-card-detailed glass-card rounded-2xl overflow-hidden border border-white/10 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl flex flex-col justify-between group relative"
                      >
                        <div
                          className="product-main-info cursor-pointer relative"
                          onClick={() => setActiveDetailProduct(product)}
                        >
                          {/* Image with smooth zoom on hover */}
                          <div className="relative h-60 w-full overflow-hidden bg-black/30">
                            <img
                              src={product.imagen_url}
                              alt={product.nombre}
                              loading="lazy"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-95 group-hover:brightness-100"
                            />
                            <span className="absolute top-3 left-3 bg-[#1C120C]/85 backdrop-blur-md text-[#B89778] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase border border-[#B89778]/30">
                              {product.categoria}
                            </span>

                            {/* Wishlist Heart Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product.id);
                              }}
                              className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                isWishlisted
                                  ? 'bg-red-500 text-white shadow-lg animate-badge-pop'
                                  : 'bg-black/60 text-[#F8F1E9] hover:text-red-400'
                              }`}
                              title={isWishlisted ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
                            >
                              <i className="fas fa-heart text-sm"></i>
                            </button>
                          </div>

                          <div className="info p-5 text-center">
                            <h3 className="font-serif font-bold text-lg text-[#F8F1E9] mb-1 line-clamp-1 group-hover:text-[#B89778] transition-colors">
                              {product.nombre}
                            </h3>
                            <p className="price text-xl font-serif font-bold text-[#B89778]">
                              {formatLempiras(unitPrice)}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="p-5 pt-0 space-y-3">
                          {/* Stock badge preview */}
                          <div className="flex items-center justify-between text-[11px] text-[#D4B99F]">
                            {product.stock <= 25 ? (
                              <span className="text-amber-400 font-semibold flex items-center gap-1">
                                <i className="fas fa-bolt text-[10px]"></i> ¡Solo {product.stock} restantes!
                              </span>
                            ) : (
                              <span className="text-[#66BB6A] font-semibold flex items-center gap-1">
                                <i className="fas fa-check text-[10px]"></i> En stock ({product.stock})
                              </span>
                            )}
                            <button
                              onClick={() => setActiveDetailProduct(product)}
                              className="text-[#B89778] hover:underline font-bold"
                            >
                              Ver detalles →
                            </button>
                          </div>

                          {/* Quick Add to Cart button */}
                          <button
                            type="button"
                            onClick={(e) => handleAddToCart(product, e)}
                            className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                              isAdded
                                ? 'bg-[#66BB6A] text-[#1C120C] scale-102 shadow-green-500/30'
                                : 'bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] hover:brightness-105'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <i className="fas fa-check text-sm animate-bounce"></i>
                                <span>¡Añadido!</span>
                              </>
                            ) : (
                              <>
                                <i className="fas fa-cart-plus"></i>
                                <span>Añadir al Carrito</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {filteredProducts.length === 0 && !isLoadingCatalog && (
                <div className="p-12 text-center bg-[#382820] rounded-2xl border border-[rgba(184,151,120,0.2)]">
                  <i className="fas fa-search text-3xl text-[#8B7B6E] mb-3"></i>
                  <p className="text-[#D4B99F] text-base font-medium">
                    No encontramos productos que coincidan con tus filtros.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('Todos');
                      setSearchQuery('');
                      setFilterWishlistOnly(false);
                      setSortOption('relevancia');
                    }}
                    className="mt-4 px-4 py-2 bg-[#B89778] text-[#2A1C15] font-bold text-xs rounded-xl"
                  >
                    Restablecer Filtros
                  </button>
                </div>
              )}
            </section>
          )}

          {/* SECTION: BARRA ESPRESSO (GLASSMORPHISM) */}
          {activeSection === 'espresso-bar' && (
            <section className="space-y-8 animate-fade-in" id="espresso-bar">
              <InteractiveEspressoBar />
            </section>
          )}

          {/* SECTION: MIS PEDIDOS */}
          {activeSection === 'mis-pedidos' && (
            <section className="space-y-8 animate-fade-in" id="mis-pedidos">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F8F1E9] flex items-center gap-3">
                  <i className="fas fa-receipt text-[#B89778]"></i> Historial de Pedidos
                </h2>
                <p className="text-xs md:text-sm text-[#D4B99F] mt-1">
                  Consulta el estado de tus compras sostenibles y pedidos anteriores
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center bg-[#382820] rounded-2xl border border-[rgba(184,151,120,0.25)] space-y-3">
                  <i className="fas fa-box-open text-3xl text-[#8B7B6E]"></i>
                  <p className="text-[#D4B99F] text-base font-medium">Aún no tienes pedidos registrados.</p>
                  <button
                    onClick={() => setActiveSection('catalogo')}
                    className="px-5 py-2.5 bg-[#B89778] text-[#2A1C15] font-bold text-xs rounded-xl"
                  >
                    Explorar Catálogo
                  </button>
                </div>
              ) : (
                <div id="orders-container" className="space-y-4">
                  {orders.map((order) => {
                    const isEntregado = order.estado === 'entregado';
                    const isPendiente = order.estado === 'pendiente';

                    return (
                      <div
                        key={order.id}
                        className="order-item bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:-translate-y-0.5 transition-transform"
                      >
                        <div className="order-info space-y-1">
                          <span className="order-id text-lg font-bold text-[#F8F1E9] font-serif">
                            Pedido #{order.id}
                          </span>
                          <span className="order-date text-xs text-[#8B7B6E]">
                            <i className="far fa-calendar-alt mr-1"></i> {order.fecha_pedido} • Sucursal: {order.sucursal}
                          </span>
                          <div className="text-xs text-[#D4B99F] pt-1">
                            {order.items.map((i) => `${i.cantidad}x ${i.nombre}`).join(', ')}
                          </div>
                          {order.cupon_aplicado && (
                            <span className="text-[11px] text-[#66BB6A] block">
                              <i className="fas fa-tag mr-1"></i> Cupón aplicado: {order.cupon_aplicado}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-6 justify-between md:justify-end">
                          <div className="text-right">
                            <span className="order-total font-serif text-2xl font-bold text-[#B89778]">
                              {formatLempiras(order.total)}
                            </span>
                            {order.descuento > 0 && (
                              <span className="text-[11px] text-[#66BB6A] block">
                                (Ahorro total de {formatLempiras(order.descuento)})
                              </span>
                            )}
                          </div>

                          <span
                            className={`order-status text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                              isEntregado
                                ? 'bg-green-500/20 text-[#66BB6A] border border-green-500/30'
                                : isPendiente
                                ? 'bg-[#B89778]/20 text-[#B89778] border border-[#B89778]/30'
                                : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            }`}
                          >
                            {order.estado}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* SECTION: BLOG */}
          {activeSection === 'blog' && (
            <section className="space-y-8 animate-fade-in" id="blog">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F8F1E9] flex items-center gap-3">
                  <i className="fas fa-book-open text-[#B89778]"></i> Guía Barista & Blog de Café
                </h2>
                <p className="text-xs md:text-sm text-[#D4B99F] mt-1">
                  Aprende sobre orígenes hondureños, técnicas de extracción y molienda artesanal
                </p>
              </div>

              <div id="blog-posts-container" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="blog-post bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#8B7B6E] mb-3">
                        <span className="bg-[#B89778]/20 text-[#B89778] font-bold px-2.5 py-0.5 rounded-full">
                          {post.tag}
                        </span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-[#B89778] mb-3 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-[#F8F1E9]/90 leading-relaxed line-clamp-3">
                        {post.content}
                      </p>
                    </div>

                    <div className="pt-6 mt-4 border-t border-[rgba(184,151,120,0.15)]">
                      <button
                        type="button"
                        onClick={() => setSelectedBlogPost(post)}
                        className="px-4 py-2 rounded-full border border-[#B89778] text-[#B89778] hover:bg-[#B89778] hover:text-[#2A1C15] font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>Leer Artículo Completo</span>
                        <i className="fas fa-arrow-right text-[10px]"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SECTION: CARRITO */}
          {activeSection === 'carrito' && (
            <section className="space-y-8 animate-fade-in" id="carrito">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F8F1E9] flex items-center gap-3">
                    <i className="fas fa-shopping-bag text-[#B89778]"></i> Carrito de Compras
                  </h2>
                  <p className="text-xs md:text-sm text-[#D4B99F] mt-1">
                    Gestiona tu pedido y aprovecha descuentos con cupones o Puntos Eco
                  </p>
                </div>
                <button
                  onClick={() => setIsCartDrawerOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#B89778]/20 text-[#B89778] border border-[#B89778]/40 text-xs font-bold hover:bg-[#B89778] hover:text-[#2A1C15] transition-all cursor-pointer"
                >
                  <i className="fas fa-columns mr-1"></i> Abrir en Panel Lateral
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="p-12 text-center bg-[#382820] rounded-2xl border border-[rgba(184,151,120,0.25)] space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-black/20 text-[#8B7B6E] flex items-center justify-center text-3xl">
                    <i className="fas fa-coffee"></i>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#F8F1E9]">
                    Tu carrito está actualmente vacío
                  </h3>
                  <button
                    onClick={() => setActiveSection('catalogo')}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] font-bold text-sm tracking-wide shadow-md hover:brightness-105 transition-all"
                  >
                    Ir al Catálogo de Café
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Items list */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-[#382820] rounded-2xl p-6 border border-[rgba(184,151,120,0.25)] shadow-xl divide-y divide-[rgba(184,151,120,0.2)]">
                      {cart.map((item) => (
                        <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                          <img
                            src={item.imagen_url}
                            alt={item.nombre}
                            className="w-16 h-16 object-cover rounded-xl border border-[rgba(184,151,120,0.3)] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-[#F8F1E9] truncate">{item.nombre}</h4>
                            <p className="text-xs text-[#B89778] font-serif font-bold mt-0.5">
                              {formatLempiras(item.unitPrice)} c/u
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-[#1C120C] text-[#F8F1E9] text-xs font-bold hover:bg-[#B89778] hover:text-[#2A1C15] transition-colors"
                            >
                              -
                            </button>
                            <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 rounded-full bg-[#1C120C] text-[#F8F1E9] text-xs font-bold hover:bg-[#B89778] hover:text-[#2A1C15] transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right shrink-0 min-w-[80px]">
                            <span className="font-serif font-bold text-sm text-[#B89778] block">
                              {formatLempiras(item.unitPrice * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-[11px] text-red-400 hover:text-red-300 font-medium hover:underline mt-1"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Checkout summary */}
                  <div className="space-y-6">
                    <div className="bg-[#382820] rounded-2xl p-6 border border-[rgba(184,151,120,0.25)] shadow-xl space-y-6">
                      <h3 className="font-serif text-lg font-bold text-[#B89778] border-b border-[rgba(184,151,120,0.2)] pb-3">
                        Resumen del Pedido
                      </h3>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#F8F1E9] flex items-center gap-2">
                          <i className="fas fa-map-marker-alt text-[#B89778]"></i> Sucursal de Recogida:
                        </label>
                        <select
                          value={pickupLocation}
                          onChange={(e) => setPickupLocation(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#1C120C] text-sm text-[#F8F1E9] border border-[rgba(184,151,120,0.3)] focus:border-[#B89778] outline-none font-sans"
                        >
                          <option value="multiplaza">Mall Multiplaza (Tegucigalpa)</option>
                          <option value="galerias">Mall Galerías (San Pedro Sula)</option>
                        </select>
                      </div>

                      <div className="p-4 rounded-xl bg-[#1C120C]/70 border border-[rgba(184,151,120,0.2)] space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[#D4B99F]">Tus Puntos Eco disponibles:</span>
                          <strong className="text-[#B89778] font-bold">{currentUser?.eco_points || 0} pts</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDiscountApplied(!discountApplied)}
                          disabled={(currentUser?.eco_points || 0) < 10}
                          className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                            discountApplied
                              ? 'bg-[#B89778] text-[#2A1C15] border-[#B89778]'
                              : 'bg-transparent text-[#B89778] border-[#B89778] hover:bg-[#B89778]/10'
                          } disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                          {discountApplied ? '✓ Descuento Aplicado' : 'Canjear Puntos por Descuento'}
                        </button>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-[rgba(184,151,120,0.2)] text-sm">
                        <div className="flex justify-between text-[#D4B99F]">
                          <span>Subtotal:</span>
                          <span>{formatLempiras(cartSubtotal)}</span>
                        </div>
                        {discountApplied && discountAmount > 0 && (
                          <div className="flex justify-between text-[#66BB6A] font-bold">
                            <span>Descuento Puntos Eco:</span>
                            <span>- {formatLempiras(discountAmount)}</span>
                          </div>
                        )}
                        {appliedCoupon && couponDiscount > 0 && (
                          <div className="flex justify-between text-[#66BB6A] font-bold">
                            <span>Cupón ({appliedCoupon.code}):</span>
                            <span>- {formatLempiras(couponDiscount)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-baseline pt-3 border-t border-[rgba(184,151,120,0.3)] text-lg font-bold font-serif">
                          <span className="text-[#F8F1E9]">Total Final:</span>
                          <span className="text-2xl text-[#B89778]">{formatLempiras(cartTotal)}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isSubmittingOrder || cart.length === 0}
                        onClick={handleCheckout}
                        className="btn-primary w-full py-4 rounded-xl bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] font-bold text-sm uppercase tracking-wider shadow-xl hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmittingOrder ? 'Procesando Pedido...' : 'Finalizar Compra'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
};
