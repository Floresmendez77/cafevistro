import React from 'react';
import { EspressoDrinkRecipe } from './espressoData';
import { formatLempiras } from '../../utils/formatCurrency';

interface RecipeSelectorProps {
  filteredRecipes: EspressoDrinkRecipe[];
  activeRecipe: EspressoDrinkRecipe;
  activeCategory: 'todos' | 'espresso' | 'leche' | 'frio' | 'especial';
  setActiveCategory: (cat: 'todos' | 'espresso' | 'leche' | 'frio' | 'especial') => void;
  onSelectRecipe: (recipe: EspressoDrinkRecipe) => void;
}

export const RecipeSelector: React.FC<RecipeSelectorProps> = ({
  filteredRecipes,
  activeRecipe,
  activeCategory,
  setActiveCategory,
  onSelectRecipe,
}) => {
  return (
    <>
      {/* HEADER SECTION WITH GLASS BADGE */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[#D4B99F] text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Barra de Espresso Interactiva • Glassmorphism Barista Station
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-white tracking-tight drop-shadow-md">
            Crea tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EED5B8] via-[#B89778] to-[#8F6A48]">Extracción Perfecta</span>
          </h2>
          <p className="text-sm md:text-base text-[#D4B99F]/90 max-w-2xl mt-2 leading-relaxed font-sans">
            Menú interactivo translúcido con perfiles de extracción artesanal, visualización anatómica de capas en vaso de vidrio y personalización de granos hondureños de altura.
          </p>
        </div>

        {/* CATEGORY SELECTOR PILLS */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'espresso', label: 'Puros' },
            { id: 'leche', label: 'Con Leche' },
            { id: 'frio', label: 'En las Rocas' },
            { id: 'especial', label: 'De Autor' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                activeCategory === cat.id
                  ? 'glass-pill-active border-amber-300/40 text-white shadow-[0_0_15px_rgba(184,151,120,0.5)]'
                  : 'glass-pill border-white/10 text-[#D4B99F] hover:text-white hover:bg-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* DRINK PRESETS CAROUSEL / GRID */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs uppercase tracking-widest font-mono text-[#B89778] font-bold">
            1. Selecciona tu Receta de Base
          </span>
          <span className="text-xs text-[#D4B99F]">
            {filteredRecipes.length} recetas de espresso
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {filteredRecipes.map((recipe) => {
            const isSelected = recipe.id === activeRecipe.id;
            return (
              <button
                key={recipe.id}
                onClick={() => onSelectRecipe(recipe)}
                className={`group relative p-3 rounded-2xl flex flex-col items-center text-center transition-all duration-300 border ${
                  isSelected
                    ? 'bg-white/15 border-[#B89778] shadow-[0_8px_30px_rgba(184,151,120,0.3)] scale-[1.03] -translate-y-1'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                <div className="relative w-14 h-14 rounded-xl overflow-hidden mb-2.5 border border-white/20 shadow-inner group-hover:scale-105 transition-transform">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover"
                  />
                  {recipe.category === 'frio' && (
                    <span className="absolute bottom-0.5 right-0.5 bg-blue-500/80 text-[10px] text-white px-1 rounded-sm">
                      ❄
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white leading-tight font-serif line-clamp-1">
                  {recipe.name}
                </h4>
                <span className="text-[11px] font-mono text-[#D4B99F] font-semibold mt-1">
                  {formatLempiras(recipe.basePrice)}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B89778] mt-1.5 shadow-[0_0_8px_#B89778]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

