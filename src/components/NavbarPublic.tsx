import React from 'react';
import { useStore } from '../context/StoreContext';

interface NavbarPublicProps {
  currentTab: 'login' | 'register' | 'contact';
  setCurrentTab: (tab: 'login' | 'register' | 'contact') => void;
}

export const NavbarPublic: React.FC<NavbarPublicProps> = ({ currentTab, setCurrentTab }) => {
  const { setIsSettingsModalOpen } = useStore();

  return (
    <nav className="navbar flex justify-between items-center px-6 md:px-12 py-4 sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-[rgba(184,151,120,0.25)] transition-colors">
      <div className="navbar-brand">
        <button
          onClick={() => setCurrentTab('login')}
          className="flex items-center text-xl md:text-2xl font-serif font-black tracking-tight text-[#F8F1E9] hover:opacity-90 transition-opacity"
        >
          <img
            src="/cafe_vistro_logo.jpg"
            alt="Café Vistro Logo"
            className="h-11 w-11 mr-3 object-contain rounded-full border border-[#B89778]/50 shadow-md"
          />
          <span className="font-serif tracking-wide">Café Vistro</span>
          <span className="text-[#B89778] ml-1 font-sans text-xs uppercase px-2 py-0.5 rounded-full bg-[#B89778]/20 border border-[#B89778]/30">
            HN
          </span>
        </button>
      </div>

      <ul className="navbar-links flex items-center gap-6 list-none m-0 p-0">
        <li>
          <button
            onClick={() => setCurrentTab('login')}
            className={`font-bold text-sm md:text-base transition-colors ${
              currentTab === 'login' || currentTab === 'register'
                ? 'text-[#B89778] border-b-2 border-[#B89778] pb-1'
                : 'text-[#D4B99F]/70 hover:text-[#F8F1E9]'
            }`}
          >
            Inicio
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentTab('contact')}
            className={`font-bold text-sm md:text-base transition-colors ${
              currentTab === 'contact'
                ? 'text-[#B89778] border-b-2 border-[#B89778] pb-1'
                : 'text-[#D4B99F]/70 hover:text-[#F8F1E9]'
            }`}
          >
            Contacto
          </button>
        </li>
      </ul>

      <div className="navbar-user-actions flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsSettingsModalOpen(true)}
          className="user-action-btn text-xl text-[#B89778] hover:text-[#D4B99F] hover:rotate-45 transition-all p-2 rounded-lg"
          title="Ajustes"
          aria-label="Ajustes"
        >
          <i className="fas fa-cog"></i>
        </button>
      </div>
    </nav>
  );
};
