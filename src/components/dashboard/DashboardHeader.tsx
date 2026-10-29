import React from 'react';

interface DashboardHeaderProps {
  firstName: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  filterWishlistOnly: boolean;
  setFilterWishlistOnly: (val: boolean) => void;
  onNavigateCatalogo: () => void;
  wishlistCount: number;
  cartCount: number;
  onOpenCart: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  firstName,
  mobileMenuOpen,
  setMobileMenuOpen,
  filterWishlistOnly,
  setFilterWishlistOnly,
  onNavigateCatalogo,
  wishlistCount,
  cartCount,
  onOpenCart,
}) => {
  return (
    <header className="main-header flex items-center justify-between pb-6 mb-8 border-b border-[rgba(184,151,120,0.25)]">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-[#382820] text-[#B89778] text-lg hover:bg-[#B89778] hover:text-[#2A1C15] transition-all cursor-pointer"
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
            onNavigateCatalogo();
            setFilterWishlistOnly(!filterWishlistOnly);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
            filterWishlistOnly
              ? 'bg-red-500/20 text-red-300 border-red-500/50'
              : 'bg-[#382820] text-[#D4B99F] border-[rgba(184,151,120,0.3)] hover:text-red-400'
          }`}
          title="Ver lista de deseos"
        >
          <i className="fas fa-heart text-red-400"></i>
          <span className="hidden sm:inline">Deseos</span>
          <span className="text-[11px] bg-black/40 px-1.5 py-0.2 rounded-full">
            {wishlistCount}
          </span>
        </button>

        {/* Quick Cart Drawer Trigger with animated badge */}
        <button
          onClick={onOpenCart}
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
  );
};

