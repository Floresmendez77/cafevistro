import React from 'react';
import { useStore } from '../context/StoreContext';
import { formatLempiras } from '../utils/formatCurrency';
import { CanvasConfetti } from './CanvasConfetti';

export const OrderSuccessModal: React.FC = () => {
  const { lastCreatedOrder, setLastCreatedOrder, setActiveSection } = useStore();

  if (!lastCreatedOrder) return null;

  const handleGoToOrders = () => {
    setLastCreatedOrder(null);
    setActiveSection('mis-pedidos');
  };

  return (
    <>
      <CanvasConfetti duration={3500} />

      <div
        className="fixed inset-0 z-[280] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
        role="dialog"
        aria-modal="true"
      >
        <div className="relative w-full max-w-lg bg-[#2A1C15] text-[#F8F1E9] p-8 md:p-10 rounded-2xl border border-[rgba(184,151,120,0.35)] shadow-2xl text-center">
          {/* Animated Checkmark Circle */}
          <div className="w-16 h-16 mx-auto mb-4 bg-[#66BB6A]/20 text-[#66BB6A] rounded-full flex items-center justify-center text-3xl border border-[#66BB6A] animate-badge-pop">
            <i className="fas fa-check"></i>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#B89778] mb-1">
            ¡Pedido Confirmado!
          </h2>
          <p className="text-xs sm:text-sm text-[#D4B99F] mb-6">
            Orden <strong className="text-[#F8F1E9]">#{lastCreatedOrder.id}</strong> registrada con éxito.
            Te notificaremos por correo cuando tu café fresco esté listo para retiro.
          </p>

          <div className="bg-[#382820] p-4 rounded-xl text-left border border-[rgba(184,151,120,0.2)] mb-6 text-sm space-y-2">
            <div className="flex justify-between text-xs text-[#8B7B6E] border-b border-[rgba(184,151,120,0.2)] pb-2 mb-2">
              <span>Fecha: {lastCreatedOrder.fecha_pedido}</span>
              <span>Sucursal: {lastCreatedOrder.sucursal}</span>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
              {lastCreatedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <span className="text-[#F8F1E9] truncate max-w-[220px]">
                    {item.cantidad}x {item.nombre}
                  </span>
                  <span className="font-semibold text-[#B89778]">
                    {formatLempiras(item.cantidad * item.precio_unitario)}
                  </span>
                </div>
              ))}
            </div>

            {lastCreatedOrder.descuento > 0 && (
              <div className="flex justify-between text-xs text-[#66BB6A] pt-2 border-t border-[rgba(184,151,120,0.15)]">
                <span>Descuento Aplicado:</span>
                <span>- {formatLempiras(lastCreatedOrder.descuento)}</span>
              </div>
            )}

            <div className="flex justify-between font-bold text-base pt-2 border-t border-[rgba(184,151,120,0.2)] text-[#F8F1E9]">
              <span>Total Pagado:</span>
              <span className="text-[#B89778]">{formatLempiras(lastCreatedOrder.total)}</span>
            </div>

            <div className="mt-2 pt-2 border-t border-dashed border-[rgba(184,151,120,0.2)] flex items-center justify-between text-xs text-[#B89778]">
              <span>
                <i className="fas fa-leaf mr-1"></i> Puntos Eco acreditados:
              </span>
              <span className="font-bold">+{lastCreatedOrder.puntos_ganados} pts</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setLastCreatedOrder(null)}
              className="px-5 py-2.5 rounded-xl border border-[#B89778] text-[#B89778] hover:bg-[#B89778]/10 font-bold text-xs uppercase tracking-wider transition-all"
            >
              Seguir Comprando
            </button>
            <button
              onClick={handleGoToOrders}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] font-bold text-xs uppercase tracking-wider hover:brightness-105 transition-all shadow-md"
            >
              Ver Mis Pedidos
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
