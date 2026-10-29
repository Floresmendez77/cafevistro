import React from 'react';
import { CartItem, Coupon } from '../../types';
import { formatLempiras } from '../../utils/formatCurrency';

interface DashboardCarritoProps {
  cart: CartItem[];
  cartSubtotal: number;
  cartTotal: number;
  discountApplied: boolean;
  setDiscountApplied: (applied: boolean) => void;
  discountAmount: number;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  ecoPointsAvailable: number;
  pickupLocation: string;
  setPickupLocation: (loc: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  onCheckout: () => void;
  isSubmittingOrder: boolean;
  onNavigateCatalogo: () => void;
  onOpenCartDrawer: () => void;
}

export const DashboardCarrito: React.FC<DashboardCarritoProps> = ({
  cart,
  cartSubtotal,
  cartTotal,
  discountApplied,
  setDiscountApplied,
  discountAmount,
  appliedCoupon,
  couponDiscount,
  ecoPointsAvailable,
  pickupLocation,
  setPickupLocation,
  updateQuantity,
  removeFromCart,
  onCheckout,
  isSubmittingOrder,
  onNavigateCatalogo,
  onOpenCartDrawer,
}) => {
  return (
    <section className="space-y-8 animate-fade-in" id="carrito">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F8F1E9] flex items-center gap-3">
            <i className="fas fa-shopping-bag text-[#B89778]"></i> Carrito de Compras
          </h2>
          <p className="text-xs md:text-sm text-[#D4B99F] mt-1">
            Gestiona tu pedido y aprovecha descuentos con cupones o Puntos Eco
          </p>
        </div>
        <button
          onClick={onOpenCartDrawer}
          className="px-4 py-2 rounded-xl bg-[#B89778]/20 text-[#B89778] border border-[#B89778]/40 text-xs font-bold hover:bg-[#B89778] hover:text-[#2A1C15] transition-all cursor-pointer"
        >
          <i className="fas fa-columns mr-1"></i> Abrir en Panel Lateral
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="p-12 text-center bg-[#382820] rounded-2xl border border-[rgba(184,151,120,0.25)] space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-black/20 text-[#8B7B6E] flex items-center justify-center text-3xl">
            <i className="fas fa-coffee"></i>
          </div>
          <h3 className="font-serif text-xl font-bold text-[#F8F1E9]">
            Tu carrito está actualmente vacío
          </h3>
          <button
            onClick={onNavigateCatalogo}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] font-bold text-sm tracking-wide shadow-md hover:brightness-105 transition-all cursor-pointer"
          >
            Ir al Catálogo de Café
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#382820] rounded-2xl p-6 border border-[rgba(184,151,120,0.25)] shadow-xl divide-y divide-[rgba(184,151,120,0.2)]">
              {cart.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                  <img
                    src={item.imagen_url}
                    alt={item.nombre}
                    className="w-16 h-16 object-cover rounded-xl border border-[rgba(184,151,120,0.3)] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-[#F8F1E9] truncate">{item.nombre}</h4>
                    <p className="text-xs text-[#B89778] font-serif font-bold mt-0.5">
                      {formatLempiras(item.unitPrice)} c/u
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-7 h-7 rounded-full bg-[#1C120C] text-[#F8F1E9] text-xs font-bold hover:bg-[#B89778] hover:text-[#2A1C15] transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-7 h-7 rounded-full bg-[#1C120C] text-[#F8F1E9] text-xs font-bold hover:bg-[#B89778] hover:text-[#2A1C15] transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right shrink-0 min-w-[80px]">
                    <span className="font-serif font-bold text-sm text-[#B89778] block">
                      {formatLempiras(item.unitPrice * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[11px] text-red-400 hover:text-red-300 font-medium hover:underline mt-1 cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout summary */}
          <div className="space-y-6">
            <div className="bg-[#382820] rounded-2xl p-6 border border-[rgba(184,151,120,0.25)] shadow-xl space-y-6">
              <h3 className="font-serif text-lg font-bold text-[#B89778] border-b border-[rgba(184,151,120,0.2)] pb-3">
                Resumen del Pedido
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#F8F1E9] flex items-center gap-2">
                  <i className="fas fa-map-marker-alt text-[#B89778]"></i> Sucursal de Recogida:
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#1C120C] text-sm text-[#F8F1E9] border border-[rgba(184,151,120,0.3)] focus:border-[#B89778] outline-none font-sans cursor-pointer"
                >
                  <option value="Mall Multiplaza">Mall Multiplaza (Tegucigalpa)</option>
                  <option value="Mall Galerías">Mall Galerías (San Pedro Sula)</option>
                </select>
              </div>

              <div className="p-4 rounded-xl bg-[#1C120C]/70 border border-[rgba(184,151,120,0.2)] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#D4B99F]">Tus Puntos Eco disponibles:</span>
                  <strong className="text-[#B89778] font-bold">{ecoPointsAvailable} pts</strong>
                </div>
                <button
                  type="button"
                  onClick={() => setDiscountApplied(!discountApplied)}
                  disabled={ecoPointsAvailable < 10}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                    discountApplied
                      ? 'bg-[#B89778] text-[#2A1C15] border-[#B89778]'
                      : 'bg-transparent text-[#B89778] border-[#B89778] hover:bg-[#B89778]/10'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {discountApplied ? '✓ Descuento Aplicado' : 'Canjear Puntos por Descuento'}
                </button>
              </div>

              <div className="space-y-2 pt-2 border-t border-[rgba(184,151,120,0.2)] text-sm">
                <div className="flex justify-between text-[#D4B99F]">
                  <span>Subtotal:</span>
                  <span>{formatLempiras(cartSubtotal)}</span>
                </div>
                {discountApplied && discountAmount > 0 && (
                  <div className="flex justify-between text-[#66BB6A] font-bold">
                    <span>Descuento Puntos Eco:</span>
                    <span>- {formatLempiras(discountAmount)}</span>
                  </div>
                )}
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-[#66BB6A] font-bold">
                    <span>Cupón ({appliedCoupon.code}):</span>
                    <span>- {formatLempiras(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-3 border-t border-[rgba(184,151,120,0.3)] text-lg font-bold font-serif">
                  <span className="text-[#F8F1E9]">Total Final:</span>
                  <span className="text-2xl text-[#B89778]">{formatLempiras(cartTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                disabled={isSubmittingOrder || cart.length === 0}
                onClick={onCheckout}
                className="btn-primary w-full py-4 rounded-xl bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] font-bold text-sm uppercase tracking-wider shadow-xl hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingOrder ? 'Procesando Pedido...' : 'Finalizar Compra'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
