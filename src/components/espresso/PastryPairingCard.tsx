import React from 'react';
import { PastryPairingItem } from './espressoData';
import { formatLempiras } from '../../utils/formatCurrency';

interface PastryPairingCardProps {
  currentPairing: PastryPairingItem;
  totalPrice: number;
  pairingAddedToast: boolean;
  comboAddedToast: boolean;
  onAddPairing: () => void;
  onAddCombo: () => void;
}

export const PastryPairingCard: React.FC<PastryPairingCardProps> = ({
  currentPairing,
  totalPrice,
  pairingAddedToast,
  comboAddedToast,
  onAddPairing,
  onAddCombo,
}) => {
  return (
    <div className="glass-card p-4 sm:p-5 rounded-2xl border border-[#B89778]/40 bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-[#B89778]/10 relative overflow-hidden group">
      {/* Subtle golden ambient glow */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B89778] animate-pulse" />
          <span className="text-xs uppercase tracking-wider font-mono font-bold text-[#EED5B8]">
            Maridaje de Autor Sugerido
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#B89778] font-bold">
          Armonía Barista
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
        {/* Pastry Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-white/20 shadow-md">
          <img
            src={currentPairing.imagen_url}
            alt={currentPairing.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          <span className="absolute bottom-1.5 left-1.5 text-[9px] uppercase tracking-wider font-bold bg-[#1C120C]/80 px-1.5 py-0.5 rounded text-[#D4B99F]">
            Artesanal
          </span>
        </div>

        {/* Pastry Info & Tasting Note */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h4 className="font-serif font-bold text-sm sm:text-base text-white">
              {currentPairing.nombre}
            </h4>
            <span className="font-mono font-black text-sm text-[#EED5B8]">
              {formatLempiras(currentPairing.precio)}
            </span>
          </div>

          <p className="text-xs text-[#D4B99F]/90 mt-1 line-clamp-2 leading-relaxed">
            {currentPairing.maridajeRazon}
          </p>

          <div className="flex items-center gap-1.5 mt-2 justify-center sm:justify-start">
            <span className="text-[10px] text-amber-200/90 font-mono bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
              ✨ {currentPairing.maridajeNota}
            </span>
          </div>
        </div>
      </div>

      {/* Direct 1-Click Buttons for Pastry & Combo */}
      <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5 relative z-10">
        <span className="text-[11px] text-[#D4B99F]">
          Disfruta la experiencia gastronómica completa:
        </span>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onAddPairing}
            disabled={pairingAddedToast}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
              pairingAddedToast
                ? 'bg-emerald-500 text-white border-transparent'
                : 'bg-white/10 border-white/20 text-[#F8F1E9] hover:bg-white/20'
            }`}
          >
            {pairingAddedToast ? '✓ ¡Repostería Agregada!' : `+ Solo Repostería (${formatLempiras(currentPairing.precio)})`}
          </button>

          <button
            onClick={onAddCombo}
            disabled={comboAddedToast}
            className={`px-4 py-1.5 rounded-lg text-xs font-serif font-black tracking-wide transition-all shadow cursor-pointer ${
              comboAddedToast
                ? 'bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-amber-500 to-[#B89778] text-[#1E130D] hover:shadow-lg hover:scale-102'
            }`}
          >
            {comboAddedToast ? '✓ ¡Dúo Agregado al Carrito!' : `★ Dúo Barista (${formatLempiras(totalPrice + currentPairing.precio)})`}
          </button>
        </div>
      </div>
    </div>
  );
};
