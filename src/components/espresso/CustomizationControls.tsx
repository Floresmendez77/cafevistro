import React from 'react';
import { ORIGINS, MILK_OPTIONS, TOPPING_OPTIONS } from './espressoData';
import { formatLempiras } from '../../utils/formatCurrency';

interface CustomizationControlsProps {
  selectedOrigin: string;
  setSelectedOrigin: (id: string) => void;
  selectedShot: 'solo' | 'doppio' | 'ristretto' | 'lungo';
  setSelectedShot: (s: 'solo' | 'doppio' | 'ristretto' | 'lungo') => void;
  selectedTemp: 'caliente' | 'frio';
  setSelectedTemp: (t: 'caliente' | 'frio') => void;
  selectedMilk: string;
  setSelectedMilk: (m: string) => void;
  selectedTopping: string;
  setSelectedTopping: (t: string) => void;
  currentOrigin: typeof ORIGINS[0];
  currentMilk: typeof MILK_OPTIONS[0];
}

export const CustomizationControls: React.FC<CustomizationControlsProps> = ({
  selectedOrigin,
  setSelectedOrigin,
  selectedShot,
  setSelectedShot,
  selectedTemp,
  setSelectedTemp,
  selectedMilk,
  setSelectedMilk,
  selectedTopping,
  setSelectedTopping,
  currentOrigin,
  currentMilk,
}) => {
  return (
    <div className="space-y-5">
      {/* OPTION 1: ORIGIN SELECTION */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs uppercase tracking-wider font-mono font-bold text-[#EED5B8] flex items-center gap-2">
            <i className="fas fa-mountain text-[#B89778]"></i> 2. Finca y Variedad de Grano
          </label>
          <span className="text-xs text-[#D4B99F] font-mono">
            {currentOrigin.priceMod > 0 ? `+${formatLempiras(currentOrigin.priceMod)}` : 'Incluido'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {ORIGINS.map((orig) => (
            <button
              key={orig.id}
              onClick={() => setSelectedOrigin(orig.id)}
              className={`p-3 rounded-xl text-left transition-all border ${
                selectedOrigin === orig.id
                  ? 'bg-white/20 border-[#B89778] text-white shadow-md'
                  : 'bg-white/5 border-white/10 text-[#D4B99F] hover:bg-white/10'
              }`}
            >
              <div className="font-bold text-xs font-serif text-white">{orig.name}</div>
              <div className="text-[10px] text-[#D4B99F]/80 line-clamp-1 mt-0.5">{orig.notes}</div>
            </button>
          ))}
        </div>
      </div>

      {/* OPTION 2: SHOT EXTRACTION & TEMPERATURE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Shots */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10">
          <label className="text-xs uppercase tracking-wider font-mono font-bold text-[#EED5B8] flex items-center gap-2 mb-3">
            <i className="fas fa-filter text-[#B89778]"></i> 3. Tipo de Extracción
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { id: 'solo', label: 'Solo (30ml)' },
              { id: 'doppio', label: 'Doppio (60ml)' },
              { id: 'ristretto', label: 'Ristretto (20ml)' },
              { id: 'lungo', label: 'Lungo (90ml)' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedShot(s.id as any)}
                className={`p-2 rounded-xl text-center font-semibold transition-all border ${
                  selectedShot === s.id
                    ? 'bg-[#B89778] text-[#2A1C15] font-bold border-transparent shadow'
                    : 'bg-white/5 border-white/10 text-[#D4B99F] hover:bg-white/10'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Temperature */}
        <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10">
          <label className="text-xs uppercase tracking-wider font-mono font-bold text-[#EED5B8] flex items-center gap-2 mb-3">
            <i className="fas fa-thermometer-half text-[#B89778]"></i> 4. Temperatura
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => setSelectedTemp('caliente')}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border ${
                selectedTemp === 'caliente'
                  ? 'bg-amber-600/40 text-amber-200 border-amber-400/50 shadow'
                  : 'bg-white/5 border-white/10 text-[#D4B99F] hover:bg-white/10'
              }`}
            >
              <i className="fas fa-fire-alt text-amber-400"></i> Caliente (65°C)
            </button>
            <button
              onClick={() => setSelectedTemp('frio')}
              className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border ${
                selectedTemp === 'frio'
                  ? 'bg-cyan-600/40 text-cyan-200 border-cyan-400/50 shadow'
                  : 'bg-white/5 border-white/10 text-[#D4B99F] hover:bg-white/10'
              }`}
            >
              <i className="fas fa-snowflake text-cyan-300"></i> Sobre Hielo
            </button>
          </div>
        </div>
      </div>

      {/* OPTION 3: MILK & INFUSION BASE */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs uppercase tracking-wider font-mono font-bold text-[#EED5B8] flex items-center gap-2">
            <i className="fas fa-tint text-[#B89778]"></i> 5. Texturizado o Base
          </label>
          <span className="text-xs text-[#D4B99F] font-mono">
            {currentMilk.priceMod > 0 ? `+${formatLempiras(currentMilk.priceMod)}` : 'Sin recargo'}
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {MILK_OPTIONS.map((milk) => (
            <button
              key={milk.id}
              onClick={() => setSelectedMilk(milk.id)}
              className={`p-2.5 rounded-xl text-left transition-all border ${
                selectedMilk === milk.id
                  ? 'bg-white/20 border-[#B89778] text-white shadow-sm font-bold'
                  : 'bg-white/5 border-white/10 text-[#D4B99F] hover:bg-white/10'
              }`}
            >
              <div className="truncate">{milk.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* OPTION 4: BOTANICAL AROMA & SWEETNESS */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-white/10">
        <label className="text-xs uppercase tracking-wider font-mono font-bold text-[#EED5B8] flex items-center gap-2 mb-3">
          <i className="fas fa-seedling text-[#B89778]"></i> 6. Toque Botánico / Topping
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {TOPPING_OPTIONS.map((top) => (
            <button
              key={top.id}
              onClick={() => setSelectedTopping(top.id)}
              className={`p-2.5 rounded-xl text-left transition-all border ${
                selectedTopping === top.id
                  ? 'bg-white/20 border-[#B89778] text-white font-bold shadow-sm'
                  : 'bg-white/5 border-white/10 text-[#D4B99F] hover:bg-white/10'
              }`}
            >
              <div className="truncate">{top.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

