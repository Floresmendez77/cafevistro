import React, { useState, useEffect, useRef } from 'react';

export const EcoImpactSection: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [counts, setCounts] = useState({
    bottles: 0,
    filters: 0,
    shadeTrees: 0,
    fairTradeScore: 0
  });

  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1800;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const progress = Math.min((currentTime - startTime) / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);

            setCounts({
              bottles: Math.floor(easeProgress * 3240),
              filters: Math.floor(easeProgress * 1890),
              shadeTrees: Math.floor(easeProgress * 450),
              fairTradeScore: Math.floor(easeProgress * 100)
            });

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.25 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div
      ref={sectionRef}
      className="rounded-3xl bg-[#2A1C15] border border-[rgba(184,151,120,0.3)] shadow-2xl p-8 md:p-12 mb-12 relative overflow-hidden"
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs uppercase tracking-widest text-[#B89778] font-bold px-3 py-1 rounded-full bg-[#B89778]/15 border border-[#B89778]/30">
          Impacto Sostenible en Honduras
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F8F1E9] mt-3 mb-2">
          Cada Taza Regenera Nuestros Bosques de Altura
        </h2>
        <p className="text-xs sm:text-sm text-[#D4B99F] leading-relaxed">
          Nuestros granos se cultivan en policultivos bajo dosel forestal en Marcala y Santa Bárbara, eliminando empaques de un solo uso y garantizando precios dignos directos al caficultor.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-[#382820] border border-[rgba(184,151,120,0.2)] shadow-md hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#B89778]/20 text-[#B89778] flex items-center justify-center text-xl mb-3">
            <i className="fas fa-wine-bottle"></i>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#B89778] mb-1">
            {counts.bottles.toLocaleString()}+
          </div>
          <p className="text-xs font-semibold text-[#F8F1E9]">Envases Plásticos Evitados</p>
          <span className="text-[10px] text-[#8B7B6E] block mt-1">Con vidrio retornable y bolsas kraft</span>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-[#382820] border border-[rgba(184,151,120,0.2)] shadow-md hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#66BB6A]/20 text-[#66BB6A] flex items-center justify-center text-xl mb-3">
            <i className="fas fa-filter"></i>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#66BB6A] mb-1">
            {counts.filters.toLocaleString()}+
          </div>
          <p className="text-xs font-semibold text-[#F8F1E9]">Filtros Desechables Ahorrados</p>
          <span className="text-[10px] text-[#8B7B6E] block mt-1">Con tela orgánica y prensa francesa</span>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-[#382820] border border-[rgba(184,151,120,0.2)] shadow-md hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#B89778]/20 text-[#B89778] flex items-center justify-center text-xl mb-3">
            <i className="fas fa-tree"></i>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#B89778] mb-1">
            {counts.shadeTrees.toLocaleString()}+
          </div>
          <p className="text-xs font-semibold text-[#F8F1E9]">Árboles Nativos Preservados</p>
          <span className="text-[10px] text-[#8B7B6E] block mt-1">Agricultura regenerativa de sombra</span>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-[#382820] border border-[rgba(184,151,120,0.2)] shadow-md hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#D4B99F]/20 text-[#D4B99F] flex items-center justify-center text-xl mb-3">
            <i className="fas fa-handshake"></i>
          </div>
          <div className="font-serif text-2xl sm:text-3xl font-bold text-[#D4B99F] mb-1">
            {counts.fairTradeScore}%
          </div>
          <p className="text-xs font-semibold text-[#F8F1E9]">Trato Directo Sin Intermediarios</p>
          <span className="text-[10px] text-[#8B7B6E] block mt-1">Prima garantizada al caficultor</span>
        </div>
      </div>
    </div>
  );
};
