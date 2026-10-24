import React, { useState } from 'react';
import { useStore, FREE_SHIPPING_THRESHOLD } from '../context/StoreContext';
import { formatLempiras } from '../utils/formatCurrency';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal,
    discountApplied,
    setDiscountApplied,
    discountAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponDiscount,
    freeShippingProgress,
    amountNeededForFreeShipping,
    cartTotal,
    currentUser,
    pickupLocation,
    setPickupLocation,
    createOrder,
    setActiveSection,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleCheckout = async () => {
    const res = await createOrder();
    if (res.success) {
      setIsCartDrawerOpen(false);
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponInput('');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[250] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#2A1C15] text-[#F8F1E9] border-l border-[rgba(184,151,120,0.3)] shadow-2xl flex flex-col justify-between animate-fade-in">
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-[rgba(184,151,120,0.25)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#B89778]/20 text-[#B89778] flex items-center justify-center text-lg border border-[#B89778]/40">
                <i className="fas fa-shopping-bag"></i>
              </div>
              <div>
                <h2 className="font-serif font-bold text-xl text-[#F8F1E9]">Tu Carrito</h2>
                <span className="text-xs text-[#D4B99F]">
                  {cartCount} {cartCount === 1 ? 'producto' : 'productos'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="text-2xl text-[#D4B99F] hover:text-[#B89778] p-2 hover:rotate-90 transition-transform"
              aria-label="Cerrar carrito"
            >
              &times;
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 py-3 bg-[#1C120C]/80 border-b border-[rgba(184,151,120,0.2)]">
            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-[#D4B99F]">
                <i className="fas fa-truck text-[#B89778]"></i>
                {amountNeededForFreeShipping === 0 ? (
                  <strong className="text-[#66BB6A]">¡Calificas para Envío Gratis!</strong>
                ) : (
                  <span>
                    Faltan <strong className="text-[#B89778]">{formatLempiras(amountNeededForFreeShipping)}</strong> para Envío Gratis
                  </span>
                )}
              </span>
              <span className="text-[11px] text-[#8B7B6E]">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#382820] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#B89778] to-[#66BB6A] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Drawer Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#382820] text-[#8B7B6E] flex items-center justify-center text-2xl border border-[rgba(184,151,120,0.2)]">
                  <i className="fas fa-coffee"></i>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#F8F1E9]">Tu carrito está vacío</h3>
                <p className="text-xs text-[#D4B99F] max-w-xs mx-auto">
                  Agrega granos de origen único, métodos de extracción o accesorios barista para empezar.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setActiveSection('catalogo');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#B89778] text-[#2A1C15] font-bold text-xs uppercase tracking-wider hover:bg-[#D4B99F] transition-all shadow-md cursor-pointer"
                >
                  Ver Catálogo de Café
                </button>
              </div>
            ) : (
              <div className="divide-y divide-[rgba(184,151,120,0.2)]">
                {cart.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-3">
                    <img
                      src={item.imagen_url}
                      alt={item.nombre}
                      className="w-16 h-16 object-cover rounded-xl border border-[rgba(184,151,120,0.3)] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-[#F8F1E9] truncate">
                        {item.nombre}
                      </h4>
                      <p className="font-serif text-xs font-bold text-[#B89778] mt-0.5">
                        {formatLempiras(item.unitPrice)}
                      </p>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-[#382820] text-[#F8F1E9] text-xs font-bold hover:bg-[#B89778] hover:text-[#2A1C15] transition-colors"
                          aria-label="Restar una unidad"
                        >
                          -
                        </button>
                        <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-[#382820] text-[#F8F1E9] text-xs font-bold hover:bg-[#B89778] hover:text-[#2A1C15] transition-colors"
                          aria-label="Sumar una unidad"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[11px] text-red-400 hover:text-red-300 ml-2"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-serif font-bold text-sm text-[#B89778]">
                        {formatLempiras(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer with Coupon, Eco Points, and Checkout */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-[rgba(184,151,120,0.25)] bg-[#231711] space-y-3.5">
              {/* Coupon Code Input */}
              <div>
                {appliedCoupon ? (
                  <div className="p-2.5 rounded-xl bg-[#66BB6A]/15 border border-[#66BB6A]/30 flex items-center justify-between text-xs">
                    <span className="text-[#66BB6A] font-semibold flex items-center gap-1.5">
                      <i className="fas fa-tag"></i>
                      Cupón <strong>{appliedCoupon.code}</strong> ({appliedCoupon.description})
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Remover cupón"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cupón (ej. CAFE15, VISTRO50)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#2A1C15] text-xs text-[#F8F1E9] border border-[rgba(184,151,120,0.3)] focus:border-[#B89778] outline-none uppercase placeholder:normal-case"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-[#382820] hover:bg-[#B89778] hover:text-[#2A1C15] text-xs font-bold border border-[rgba(184,151,120,0.3)] transition-all"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
              </div>

              {/* Branch Selector */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#D4B99F] flex items-center gap-1.5">
                  <i className="fas fa-store text-[#B89778]"></i> Sucursal de Retiro:
                </label>
                <select
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#2A1C15] text-xs text-[#F8F1E9] border border-[rgba(184,151,120,0.3)] focus:border-[#B89778] outline-none"
                >
                  <option value="multiplaza">Mall Multiplaza (Tegucigalpa)</option>
                  <option value="galerias">Mall Galerías (San Pedro Sula)</option>
                </select>
              </div>

              {/* Eco Points Discount Box */}
              <div className="p-2.5 rounded-lg bg-[#382820] border border-[rgba(184,151,120,0.2)] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#D4B99F] block font-medium">Puntos Eco ({currentUser?.eco_points || 0} pts)</span>
                  <span className="text-[10px] text-[#8B7B6E]">10 pts = L. 1.00 de descuento</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDiscountApplied(!discountApplied)}
                  disabled={(currentUser?.eco_points || 0) < 10}
                  className={`px-3 py-1 rounded-md font-bold text-[11px] transition-all border ${
                    discountApplied
                      ? 'bg-[#B89778] text-[#2A1C15] border-[#B89778]'
                      : 'border-[#B89778] text-[#B89778] hover:bg-[#B89778]/15'
                  }`}
                >
                  {discountApplied ? '✓ Aplicado' : 'Canjear'}
                </button>
              </div>

              {/* Total Calculation Breakdown */}
              <div className="space-y-1 text-xs pt-1">
                <div className="flex justify-between text-[#D4B99F]">
                  <span>Subtotal</span>
                  <span>{formatLempiras(cartSubtotal)}</span>
                </div>
                {discountApplied && discountAmount > 0 && (
                  <div className="flex justify-between text-[#66BB6A] font-bold">
                    <span>Descuento Puntos Eco</span>
                    <span>- {formatLempiras(discountAmount)}</span>
                  </div>
                )}
                {appliedCoupon && couponDiscount > 0 && (
                  <div className="flex justify-between text-[#66BB6A] font-bold">
                    <span>Descuento Cupón ({appliedCoupon.code})</span>
                    <span>- {formatLempiras(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-serif font-bold text-[#F8F1E9] pt-2 border-t border-[rgba(184,151,120,0.2)]">
                  <span>Total Final:</span>
                  <span className="text-[#B89778] text-lg">{formatLempiras(cartTotal)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(184,151,120,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                Confirmar y Pagar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
