import React from 'react';
import { useStore } from '../context/StoreContext';

export const HeroSection: React.FC = () => {
  const { setActiveSection } = useStore();

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-r from-[#1E130D] via-[#2A1C15] to-[#362217] border border-[rgba(184,151,120,0.3)] shadow-2xl p-8 md:p-14 lg:p-16 mb-12">
      {/* Background Decorative Radial Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(184,151,120,0.18)_0%,transparent_70%)] blur-2xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(74,55,46,0.35)_0%,transparent_70%)] blur-2xl pointer-events-none" />

      {/* Floating Leaves (Pure SVG + CSS) */}
      <div className="absolute top-8 right-16 pointer-events-none leaf-float-1 opacity-25 hidden md:block">
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#B89778" strokeWidth="1.5">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>

      <div className="absolute bottom-10 right-36 pointer-events-none leaf-float-2 opacity-20 hidden md:block">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#B89778" strokeWidth="1.5">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl space-y-6">
        {/* Eco Micro-badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B89778]/15 border border-[#B89778]/35 text-[#B89778] text-xs font-semibold tracking-wide animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-[#66BB6A] animate-pulse"></span>
          <span>Cosecha 2026 de Altura • Fincas de Marcala y Santa Bárbara</span>
        </div>

        {/* Headline with Steam Graphics */}
        <div className="relative">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#F8F1E9] leading-tight tracking-tight animate-fade-up">
            El Arte del Café de Especialidad Hondureño
          </h1>

          {/* Pure SVG Steam Animation */}
          <div className="absolute -top-10 -right-8 pointer-events-none hidden sm:block">
            <svg width="60" height="70" viewBox="0 0 60 70" fill="none">
              <path
                d="M15 60 C12 45, 20 35, 16 15"
                stroke="#B89778"
                strokeWidth="2"
                strokeLinecap="round"
                className="steam-path-1"
              />
              <path
                d="M30 65 C26 48, 36 38, 31 10"
                stroke="#D4B99F"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="steam-path-2"
              />
              <path
                d="M45 62 C40 46, 50 36, 44 20"
                stroke="#B89778"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="steam-path-3"
              />
            </svg>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#D4B99F] leading-relaxed max-w-xl animate-fade-up">
          Tostado en pequeños lotes con trazabilidad desde el productor hasta tu taza.
          Empaques 100% compostables, libre de plásticos y con métodos que respetan los ecosistemas locales.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-4 animate-fade-up">
          <button
            type="button"
            onClick={() => setActiveSection('catalogo')}
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] font-bold text-sm tracking-wide shadow-lg hover:shadow-[0_0_25px_rgba(184,151,120,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Explorar Selección de Cosecha</span>
            <i className="fas fa-arrow-right text-xs"></i>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('blog')}
            className="px-6 py-3.5 rounded-xl border border-[#B89778]/50 text-[#F8F1E9] hover:bg-[#B89778]/15 font-bold text-sm tracking-wide transition-all"
          >
            <i className="fas fa-book-open mr-2 text-[#B89778]"></i>
            Guía de Extracción
          </button>
        </div>

        {/* Eco Trust Pillars */}
        <div className="pt-4 border-t border-[rgba(184,151,120,0.2)] grid grid-cols-3 gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs text-[#D4B99F]">
            <i className="fas fa-seedling text-[#66BB6A] text-sm"></i>
            <span className="font-medium">100% Orgánico</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#D4B99F]">
            <i className="fas fa-hand-holding-heart text-[#B89778] text-sm"></i>
            <span className="font-medium">Comercio Justo</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#D4B99F]">
            <i className="fas fa-recycle text-[#B89778] text-sm"></i>
            <span className="font-medium">Cero Residuos</span>
          </div>
        </div>
      </div>
    </div>
  );
};
