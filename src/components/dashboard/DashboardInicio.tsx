import React from 'react';
import { HeroSection } from '../HeroSection';
import { InteractiveEspressoBar } from '../InteractiveEspressoBar';
import { EcoImpactSection } from '../EcoImpactSection';
import { User, Product } from '../../types';
import { formatLempiras } from '../../utils/formatCurrency';

interface DashboardInicioProps {
  currentUser: User | null;
  ordersCount: number;
  productsCount: number;
  onExplorePastry: () => void;
  pastryProducts: Product[];
  onAddToCart: (p: Product, e?: React.MouseEvent) => void;
  addedFeedback: Record<number, boolean>;
  onSelectDetailProduct: (p: Product) => void;
}

export const DashboardInicio: React.FC<DashboardInicioProps> = ({
  currentUser,
  ordersCount,
  productsCount,
  onExplorePastry,
  pastryProducts,
  onAddToCart,
  addedFeedback,
  onSelectDetailProduct,
}) => {
  return (
    <section className="space-y-12 animate-fade-in" id="inicio">
      <HeroSection />

      {/* BARRA DE ESPRESSO INTERACTIVA (GLASSMORPHISM) */}
      <InteractiveEspressoBar />

      {/* REPOSTERÍA DE AUTOR & MARIDAJE SHOWCASE */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold mb-2">
              <i className="fas fa-cookie-bite text-rose-400"></i> Repostería & Cocina Dulce
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
              Repostería de Autor al Espresso
            </h3>
            <p className="text-xs sm:text-sm text-[#D4B99F] mt-1 max-w-xl">
              Elaborada artesanalmente cada mañana con café de estricta altura, mantequilla pura y cacao fino de Honduras.
            </p>
          </div>

          <button
            onClick={onExplorePastry}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-[#F8F1E9] hover:bg-white/20 transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <span>Ver toda la repostería</span>
            <i className="fas fa-arrow-right text-[10px]"></i>
          </button>
        </div>

        {/* Mini Grid of Pastry Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          {pastryProducts.slice(0, 4).map((p) => {
            const isAdded = !!addedFeedback[p.id];
            return (
              <div
                key={p.id}
                className="bg-[#2B1A12]/80 border border-white/10 rounded-2xl overflow-hidden p-3 flex flex-col justify-between group hover:border-[#B89778] transition-all"
              >
                <div>
                  <div
                    className="relative h-36 rounded-xl overflow-hidden mb-3 cursor-pointer"
                    onClick={() => onSelectDetailProduct(p)}
                  >
                    <img
                      src={p.imagen_url}
                      alt={p.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute bottom-2 left-2 text-[9px] font-bold uppercase bg-black/70 px-2 py-0.5 rounded text-[#D4B99F]">
                      Artesanal
                    </span>
                  </div>
                  <h4
                    onClick={() => onSelectDetailProduct(p)}
                    className="font-serif font-bold text-sm text-white line-clamp-1 group-hover:text-[#B89778] transition-colors cursor-pointer"
                  >
                    {p.nombre}
                  </h4>
                  <p className="text-[11px] text-[#D4B99F]/80 line-clamp-2 mt-1">
                    {p.descripcion}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[#B89778]">
                    {formatLempiras(p.precio)}
                  </span>
                  <button
                    onClick={(e) => onAddToCart(p, e)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#B89778] text-[#2A1C15] hover:bg-[#D4B99F]'
                    }`}
                  >
                    {isAdded ? '✓ Agregado' : '+ Agregar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK STATS CARDS */}
      <div>
        <h3 className="text-xl md:text-2xl font-serif font-bold text-[#F8F1E9] mb-4">
          Resumen de tu Cuenta Barista
        </h3>
        <div className="stats-container grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="stat-card bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl text-center hover:-translate-y-1 transition-transform">
            <h3 className="text-sm font-semibold text-[#8B7B6E] flex items-center justify-center gap-2 mb-2">
              <i className="fas fa-shopping-bag text-[#B89778]"></i> Pedidos Realizados
            </h3>
            <p className="font-serif text-3xl md:text-4xl font-bold text-[#B89778]">
              {ordersCount}
            </p>
          </div>

          <div className="stat-card bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl text-center hover:-translate-y-1 transition-transform">
            <h3 className="text-sm font-semibold text-[#8B7B6E] flex items-center justify-center gap-2 mb-2">
              <i className="fas fa-leaf text-[#B89778]"></i> Puntos Eco Acumulados
            </h3>
            <p className="font-serif text-3xl md:text-4xl font-bold text-[#B89778]">
              {currentUser?.eco_points || 0}
            </p>
          </div>

          <div className="stat-card bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl text-center hover:-translate-y-1 transition-transform">
            <h3 className="text-sm font-semibold text-[#8B7B6E] flex items-center justify-center gap-2 mb-2">
              <i className="fas fa-coffee text-[#B89778]"></i> Variedades en Catálogo
            </h3>
            <p className="font-serif text-3xl md:text-4xl font-bold text-[#B89778]">
              {productsCount}
            </p>
          </div>
        </div>
      </div>

      <EcoImpactSection />

      {/* EXPERIENCIA DE COMPRA */}
      <div>
        <h3 className="text-xl md:text-2xl font-serif font-bold text-[#F8F1E9] mb-4">
          Experiencia de Compra Sostenible
        </h3>
        <div className="process-container grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="process-step bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl hover:-translate-y-1 transition-transform text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-[#B89778]/20 text-[#B89778] font-serif font-bold text-lg flex items-center justify-center mb-3 mx-auto md:mx-0">
              1
            </div>
            <h4 className="font-serif font-bold text-lg text-[#B89778] mb-2">
              Elige tu Tueste y Molienda
            </h4>
            <p className="text-xs sm:text-sm text-[#F8F1E9]/90 leading-relaxed">
              Selecciona granos enteros para moler en casa o con molienda exacta para V60, espresso o prensa francesa.
            </p>
          </div>

          <div className="process-step bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl hover:-translate-y-1 transition-transform text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-[#B89778]/20 text-[#B89778] font-serif font-bold text-lg flex items-center justify-center mb-3 mx-auto md:mx-0">
              2
            </div>
            <h4 className="font-serif font-bold text-lg text-[#B89778] mb-2">
              Canjea Puntos y Cupones
            </h4>
            <p className="text-xs sm:text-sm text-[#F8F1E9]/90 leading-relaxed">
              Aplica tus Puntos Eco o cupones como CAFE15 y aprovecha envío gratis en compras mayores a L. 500.00.
            </p>
          </div>

          <div className="process-step bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl hover:-translate-y-1 transition-transform text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-[#B89778]/20 text-[#B89778] font-serif font-bold text-lg flex items-center justify-center mb-3 mx-auto md:mx-0">
              3
            </div>
            <h4 className="font-serif font-bold text-lg text-[#B89778] mb-2">
              Tostado Fresco a tu Taza
            </h4>
            <p className="text-xs sm:text-sm text-[#F8F1E9]/90 leading-relaxed">
              Despachamos café con menos de 72 horas de tueste para garantizar notas aromáticas plenas y crema densa.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

