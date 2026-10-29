import React from 'react';
import { EspressoDrinkRecipe } from './espressoData';

interface DrinkVisualizerProps {
  activeRecipe: EspressoDrinkRecipe;
  selectedTemp: 'caliente' | 'frio';
  selectedMilk: string;
  selectedShot: string;
  currentMilkName: string;
  tilt: { x: number; y: number };
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: () => void;
}

export const DrinkVisualizer: React.FC<DrinkVisualizerProps> = ({
  activeRecipe,
  selectedTemp,
  selectedMilk,
  selectedShot,
  currentMilkName,
  tilt,
  onMouseMove,
  onMouseLeave,
}) => {
  return (
    <div
      className="lg:col-span-5 relative glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/15 overflow-hidden transition-transform duration-300"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
      }}
    >
      {/* Top Gloss Highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.12] pointer-events-none" />

      <div className="flex items-center justify-between mb-4 relative z-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#EED5B8] uppercase">
          <i className="fas fa-layer-group text-[#B89778]"></i> Anatomía en Vidrio
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-white/80 font-mono border border-white/10">
          {activeRecipe.extractionRatio}
        </span>
      </div>

      {/* THE VISUAL GLASS CUP */}
      <div className="relative my-4 flex flex-col items-center justify-center min-h-[300px]">
        {/* Hot Steam or Ice Drops effect */}
        {selectedTemp === 'caliente' ? (
          <div className="flex gap-3 mb-2 opacity-70">
            <span className="w-1.5 h-6 rounded-full bg-white/30 blur-[1px] animate-pulse" />
            <span className="w-1.5 h-8 rounded-full bg-white/40 blur-[1px] animate-pulse delay-150" />
            <span className="w-1.5 h-5 rounded-full bg-white/25 blur-[1px] animate-pulse delay-300" />
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs text-cyan-200/80 mb-2 font-mono">
            <span>🧊 Hielo Cristalino Templado</span>
          </div>
        )}

        {/* The Glass Container with Beveled Rim and Liquid Layers */}
        <div className="relative w-44 sm:w-52 h-64 rounded-b-[40px] rounded-t-lg border-2 border-white/35 p-1 bg-gradient-to-b from-white/15 via-white/5 to-white/10 backdrop-blur-md shadow-[0_20px_45px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-end">
          {/* Specular highlights on glass edges */}
          <div className="absolute top-0 left-3 w-1.5 h-full bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none rounded-full" />
          <div className="absolute top-0 right-3 w-1 h-full bg-gradient-to-b from-white/20 via-transparent to-white/5 pointer-events-none" />
          <div className="absolute top-1 inset-x-2 h-2 rounded-full border border-white/40 bg-white/10 pointer-events-none" />

          {/* LIQUID LAYER 1: FOAM / CREMA / MICROFOAM (TOP) */}
          {activeRecipe.anatomy.foamPct > 0 && (
            <div
              style={{ height: `${activeRecipe.anatomy.foamPct}%` }}
              className="w-full relative transition-all duration-700 bg-gradient-to-b from-[#E7CBAF] via-[#D4B99F] to-[#B89778] rounded-t-sm border-b border-amber-900/30 flex items-center justify-center shadow-inner group"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:4px_4px]" />
              <span className="relative z-10 text-[10px] font-bold text-[#2A1C15] tracking-tight uppercase px-1">
                {selectedMilk === 'ninguna' ? 'Crema Dorada (25%)' : 'Microespuma Sedosa'}
              </span>
            </div>
          )}

          {/* LIQUID LAYER 2: MILK / WATER / TONIC (MIDDLE) */}
          {activeRecipe.anatomy.milkPct > 0 && (
            <div
              style={{ height: `${activeRecipe.anatomy.milkPct}%` }}
              className="w-full relative transition-all duration-700 bg-gradient-to-b from-[#F7EFE7]/90 via-[#EFE3D5]/80 to-[#E4D1BF]/90 flex items-center justify-center border-b border-white/20 shadow-inner"
            >
              <span className="relative z-10 text-[10px] font-bold text-[#4A372E] uppercase px-1">
                {currentMilkName.split('(')[0].replace('Leche de ', '')}
              </span>
            </div>
          )}

          {/* LIQUID LAYER 2.5: SPECIAL LAYER (CACAO / TONIC) */}
          {activeRecipe.anatomy.specialPct && activeRecipe.anatomy.specialPct > 0 && (
            <div
              style={{ height: `${activeRecipe.anatomy.specialPct}%` }}
              className="w-full relative transition-all duration-700 bg-gradient-to-b from-amber-950 via-[#3B2219] to-[#20100A] flex items-center justify-center border-b border-white/10 shadow-inner"
            >
              <span className="relative z-10 text-[10px] font-bold text-amber-200 uppercase px-1">
                {activeRecipe.anatomy.specialName}
              </span>
            </div>
          )}

          {/* LIQUID LAYER 3: PURE ESPRESSO EXTRACTION (BOTTOM) */}
          {activeRecipe.anatomy.coffeePct > 0 && (
            <div
              style={{ height: `${activeRecipe.anatomy.coffeePct}%` }}
              className="w-full relative transition-all duration-700 bg-gradient-to-b from-[#4A2E1F] via-[#2F1A12] to-[#1A0D08] flex items-center justify-center rounded-b-[36px] shadow-2xl"
            >
              <span className="relative z-10 text-[10px] font-mono font-bold text-[#D4B99F] uppercase px-1">
                Espresso ({selectedShot.toUpperCase()})
              </span>
            </div>
          )}
        </div>

        {/* Glass Shadow & Refraction on Surface */}
        <div className="w-36 h-4 rounded-full bg-black/60 blur-md mt-2 shadow-[0_10px_20px_rgba(0,0,0,0.8)]" />
      </div>

      {/* SENSORY TASTING NOTES BADGES */}
      <div className="relative z-10 pt-4 border-t border-white/10">
        <span className="text-[11px] font-mono uppercase text-[#B89778] block mb-2 font-bold">
          Notas Sensoriales en Taza:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {activeRecipe.notes.map((note, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-[#F8F1E9] font-medium"
            >
              ☕ {note}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
