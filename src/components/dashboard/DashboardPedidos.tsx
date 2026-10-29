import React from 'react';
import { Order } from '../../types';
import { formatLempiras } from '../../utils/formatCurrency';

interface DashboardPedidosProps {
  orders: Order[];
  onNavigateCatalogo: () => void;
}

export const DashboardPedidos: React.FC<DashboardPedidosProps> = ({
  orders,
  onNavigateCatalogo,
}) => {
  return (
    <section className="space-y-8 animate-fade-in" id="mis-pedidos">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F8F1E9] flex items-center gap-3">
            <i className="fas fa-receipt text-[#B89778]"></i> Mis Pedidos
          </h2>
          <p className="text-xs md:text-sm text-[#D4B99F] mt-1">
            Historial de compras, estado de preparación y recibos de tostaduría
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center bg-[#382820] rounded-2xl border border-[rgba(184,151,120,0.25)] space-y-3">
          <i className="fas fa-box-open text-3xl text-[#8B7B6E]"></i>
          <p className="text-[#D4B99F] text-base font-medium">Aún no tienes pedidos registrados.</p>
          <button
            onClick={onNavigateCatalogo}
            className="px-5 py-2.5 bg-[#B89778] text-[#2A1C15] font-bold text-xs rounded-xl cursor-pointer"
          >
            Explorar Catálogo
          </button>
        </div>
      ) : (
        <div id="orders-container" className="space-y-4">
          {orders.map((order) => {
            const isEntregado = order.estado === 'entregado';
            const isPendiente = order.estado === 'pendiente';

            return (
              <div
                key={order.id}
                className="order-item bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:-translate-y-0.5 transition-transform"
              >
                <div className="order-info space-y-1">
                  <span className="order-id text-lg font-bold text-[#F8F1E9] font-serif">
                    Pedido #{order.id}
                  </span>
                  <span className="order-date text-xs text-[#8B7B6E] block">
                    <i className="far fa-calendar-alt mr-1"></i> {order.fecha_pedido} • Sucursal: {order.sucursal}
                  </span>
                  <div className="text-xs text-[#D4B99F] pt-1">
                    {order.items.map((i) => `${i.cantidad}x ${i.nombre}`).join(', ')}
                  </div>
                  {order.cupon_aplicado && (
                    <span className="text-[11px] text-[#66BB6A] block">
                      <i className="fas fa-tag mr-1"></i> Cupón aplicado: {order.cupon_aplicado}
                    </span>
                  )}
                  {order.puntos_ganados ? (
                    <span className="text-[11px] text-emerald-400 block">
                      <i className="fas fa-leaf mr-1"></i> +{order.puntos_ganados} Puntos Eco acreditados
                    </span>
                  ) : null}
                </div>

                <div className="flex items-center gap-6 justify-between md:justify-end">
                  <div className="text-right">
                    <span className="order-total font-serif text-2xl font-bold text-[#B89778]">
                      {formatLempiras(order.total)}
                    </span>
                    {order.descuento > 0 && (
                      <span className="text-[11px] text-[#66BB6A] block">
                        (Ahorro total de {formatLempiras(order.descuento)})
                      </span>
                    )}
                  </div>

                  <span
                    className={`order-status text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${
                      isEntregado
                        ? 'bg-green-500/20 text-[#66BB6A] border border-green-500/30'
                        : isPendiente
                        ? 'bg-[#B89778]/20 text-[#B89778] border border-[#B89778]/30'
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}
                  >
                    {order.estado}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
