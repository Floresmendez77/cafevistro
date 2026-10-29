import React from 'react';
import { User } from '../../types';

interface DashboardSidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  currentUser: User | null;
  activeSection: string;
  setActiveSection: (sec: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  setFilterWishlistOnly: (val: boolean) => void;
  ordersCount: number;
  onOpenSettings: () => void;
  onOpenLegal: () => void;
  onLogout: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  currentUser,
  activeSection,
  setActiveSection,
  selectedCategory,
  setSelectedCategory,
  setFilterWishlistOnly,
  ordersCount,
  onOpenSettings,
  onOpenLegal,
  onLogout,
}) => {
  return (
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
          {ordersCount > 0 && (
            <span className="ml-auto bg-black/10 text-xs px-2 py-0.5 rounded-full font-bold">
              {ordersCount}
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
            onOpenLegal();
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
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold text-[#4A372E] hover:bg-black/5 transition-all text-left cursor-pointer"
        >
          <i className="fas fa-cog w-4 text-center"></i>
          <span>Ajustes de Tema</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-bold text-red-700 hover:bg-red-50 transition-all text-left cursor-pointer"
        >
          <i className="fas fa-sign-out-alt w-4 text-center"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

