import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductVariant } from '../types';
import { InteractiveEspressoBar } from './InteractiveEspressoBar';
import { Footer } from './Footer';
import { DashboardSidebar } from './dashboard/DashboardSidebar';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardInicio } from './dashboard/DashboardInicio';
import { DashboardCatalogo } from './dashboard/DashboardCatalogo';
import { DashboardPedidos } from './dashboard/DashboardPedidos';
import { DashboardBlog } from './dashboard/DashboardBlog';
import { DashboardCarrito } from './dashboard/DashboardCarrito';

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    logout,
    products,
    cart,
    cartCount,
    cartSubtotal,
    cartTotal,
    discountApplied,
    setDiscountApplied,
    discountAmount,
    appliedCoupon,
    couponDiscount,
    createOrder,
    pickupLocation,
    setPickupLocation,
    orders,
    blogPosts,
    setSelectedBlogPost,
    wishlist,
    toggleWishlist,
    addToCart,
    updateQuantity,
    removeFromCart,
    setIsSettingsModalOpen,
    setIsLegalModalOpen,
    setIsCartDrawerOpen,
    setActiveDetailProduct,
  } = useStore();

  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filterWishlistOnly, setFilterWishlistOnly] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const [selectedVariants, setSelectedVariants] = useState<Record<number, ProductVariant>>({});
  const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});
  const [addedFeedback, setAddedFeedback] = useState<Record<number, boolean>>({});

  // URL sync
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const sec = params.get('seccion');
      if (sec && ['inicio', 'catalogo', 'espresso-bar', 'mis-pedidos', 'blog', 'carrito'].includes(sec)) {
        setActiveSection(sec);
      }
      const cat = params.get('categoria');
      if (cat) setSelectedCategory(cat);
      const q = params.get('busqueda');
      if (q) {
        setSearchQuery(q);
        setDebouncedSearch(q);
      }
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update query params on navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      if (activeSection !== 'inicio') params.set('seccion', activeSection);
      if (selectedCategory !== 'Todos') params.set('categoria', selectedCategory);
      if (debouncedSearch) params.set('busqueda', debouncedSearch);

      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [activeSection, selectedCategory, debouncedSearch]);

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
    }, 1500);
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (activeSection !== 'catalogo') {
      setActiveSection('catalogo');
    }
    setMobileMenuOpen(false);
  };

  const handleCheckout = async () => {
    if (isSubmittingOrder) return;
    setIsSubmittingOrder(true);
    try {
      await createOrder();
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.categoria)))];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'Todos' || p.categoria === selectedCategory;
        const matchesSearch =
          debouncedSearch === '' ||
          p.nombre.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesWishlist = !filterWishlistOnly || wishlist.includes(p.id);
        return matchesCategory && matchesSearch && matchesWishlist;
      })
      .sort((a, b) => {
        if (sortOption === 'price-asc') return a.precio - b.precio;
        if (sortOption === 'price-desc') return b.precio - a.precio;
        if (sortOption === 'name-asc') return a.nombre.localeCompare(b.nombre);
        return 0; // featured default
      });
  }, [products, selectedCategory, debouncedSearch, filterWishlistOnly, wishlist, sortOption]);

  const pastryProducts = useMemo(() => {
    return products.filter((p) => p.categoria === 'Repostería de Autor');
  }, [products]);

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
      <DashboardSidebar
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        currentUser={currentUser}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        setFilterWishlistOnly={setFilterWishlistOnly}
        ordersCount={orders.length}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenLegal={() => setIsLegalModalOpen(true)}
        onLogout={logout}
      />

      {/* MAIN CONTENT AREA */}
      <main className="main-content flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto min-h-screen flex flex-col justify-between">
        <div>
          <DashboardHeader
            firstName={firstName}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            filterWishlistOnly={filterWishlistOnly}
            setFilterWishlistOnly={setFilterWishlistOnly}
            onNavigateCatalogo={() => setActiveSection('catalogo')}
            wishlistCount={wishlist.length}
            cartCount={cartCount}
            onOpenCart={() => setIsCartDrawerOpen(true)}
          />

          {/* SECTION: INICIO */}
          {activeSection === 'inicio' && (
            <DashboardInicio
              currentUser={currentUser}
              ordersCount={orders.length}
              productsCount={products.length}
              onExplorePastry={() => {
                setSelectedCategory('Repostería de Autor');
                setActiveSection('catalogo');
              }}
              pastryProducts={pastryProducts}
              onAddToCart={handleAddToCart}
              addedFeedback={addedFeedback}
              onSelectDetailProduct={(p) => setActiveDetailProduct(p)}
            />
          )}

          {/* SECTION: CATÁLOGO */}
          {activeSection === 'catalogo' && (
            <DashboardCatalogo
              products={products}
              filteredProducts={filteredProducts}
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategorySelect}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortOption={sortOption}
              setSortOption={setSortOption}
              filterWishlistOnly={filterWishlistOnly}
              setFilterWishlistOnly={setFilterWishlistOnly}
              wishlist={wishlist}
              toggleWishlist={toggleWishlist}
              selectedVariants={selectedVariants}
              onVariantChange={handleVariantChange}
              productQuantities={productQuantities}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
              addedFeedback={addedFeedback}
              onSelectDetailProduct={(p) => setActiveDetailProduct(p)}
            />
          )}

          {/* SECTION: ESPRESSO BAR COMPONENT DIRECT TAB */}
          {activeSection === 'espresso-bar' && (
            <section className="animate-fade-in" id="espresso-bar">
              <InteractiveEspressoBar />
            </section>
          )}

          {/* SECTION: MIS PEDIDOS */}
          {activeSection === 'mis-pedidos' && (
            <DashboardPedidos
              orders={orders}
              onNavigateCatalogo={() => setActiveSection('catalogo')}
            />
          )}

          {/* SECTION: BLOG */}
          {activeSection === 'blog' && (
            <DashboardBlog
              blogPosts={blogPosts}
              onSelectPost={(post) => setSelectedBlogPost(post)}
            />
          )}

          {/* SECTION: CARRITO */}
          {activeSection === 'carrito' && (
            <DashboardCarrito
              cart={cart}
              cartSubtotal={cartSubtotal}
              cartTotal={cartTotal}
              discountApplied={discountApplied}
              setDiscountApplied={setDiscountApplied}
              discountAmount={discountAmount}
              appliedCoupon={appliedCoupon}
              couponDiscount={couponDiscount}
              ecoPointsAvailable={currentUser?.eco_points || 0}
              pickupLocation={pickupLocation}
              setPickupLocation={setPickupLocation}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              onCheckout={handleCheckout}
              isSubmittingOrder={isSubmittingOrder}
              onNavigateCatalogo={() => setActiveSection('catalogo')}
              onOpenCartDrawer={() => setIsCartDrawerOpen(true)}
            />
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
};
