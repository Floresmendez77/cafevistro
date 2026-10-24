import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setIsLegalModalOpen, showToast } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Por favor, ingresa un correo válido.', 'error');
      return;
    }
    setNewsletterSubscribed(true);
    showToast('¡Gracias por unirte al Club de Café Vistro! Recibirás nuestras notas de cata.', 'success');
  };

  return (
    <footer className="mt-16 pt-12 pb-8 border-t border-[rgba(184,151,120,0.25)] bg-[#1F140E] text-[#F8F1E9] rounded-3xl p-8 md:p-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <img
              src="/cafe_vistro_logo.jpg"
              alt="Café Vistro Logo"
              className="w-12 h-12 object-cover rounded-full border border-[#B89778]/50 shadow-md"
            />
            <div>
              <span className="font-serif font-bold text-xl tracking-wide text-[#F8F1E9] block">
                Café Vistro<span className="text-[#B89778]">.</span>
              </span>
              <span className="text-[11px] text-[#B89778] uppercase tracking-widest font-bold">
                Specialty Coffee Roasters HN
              </span>
            </div>
          </div>

          <p className="text-xs text-[#D4B99F] leading-relaxed max-w-sm">
            Tostaduría boutique especializada en café de estricta altura de Marcala y Santa Bárbara, métodos de extracción artesanal y accesorios barista con empaque 100% ecológico y compostable.
          </p>

          {/* Social Icons (Inline SVG as requested) */}
          <div className="flex items-center gap-3 pt-2">
            {/* Instagram */}
            <a
              href="https://instagram.com/ecotiendahn"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#382820] hover:bg-[#B89778] hover:text-[#2A1C15] flex items-center justify-center text-[#D4B99F] transition-all"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/ecotiendahn"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#382820] hover:bg-[#B89778] hover:text-[#2A1C15] flex items-center justify-center text-[#D4B99F] transition-all"
              aria-label="Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/50487917652?text=Hola%20Café%20Vistro,%20deseo%20consultar%20sobre%20café%20en%20grano"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 rounded-full bg-[#382820] hover:bg-[#25D366] hover:text-white flex items-center justify-center text-[#D4B99F] transition-all"
              aria-label="WhatsApp"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-[#B89778] uppercase tracking-wider">
            Navegación
          </h4>
          <ul className="space-y-2 text-xs text-[#D4B99F]">
            <li>
              <button
                onClick={() => setIsLegalModalOpen(true)}
                className="hover:text-[#B89778] transition-colors"
              >
                Políticas y Requisitos Legales
              </button>
            </li>
            <li>
              <a href="https://maps.app.goo.gl/r6vS2GfB9E8u2e6y8" target="_blank" rel="noreferrer" className="hover:text-[#B89778] transition-colors">
                Sucursal Mall Multiplaza (TGU)
              </a>
            </li>
            <li>
              <a href="https://maps.app.goo.gl/mP2T3G4fBqN81xQy5" target="_blank" rel="noreferrer" className="hover:text-[#B89778] transition-colors">
                Sucursal Mall Galerías (SPS)
              </a>
            </li>
            <li className="text-[11px] text-[#8B7B6E]">
              Tel: +504 8791-7652
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="space-y-3">
          <h4 className="font-serif font-bold text-sm text-[#B89778] uppercase tracking-wider">
            Club Café Vistro
          </h4>
          <p className="text-xs text-[#D4B99F]">
            Recibe notas de cata de nuevos micro-lotes y guías de extracción barista:
          </p>

          {newsletterSubscribed ? (
            <div className="p-3 rounded-xl bg-[#66BB6A]/20 border border-[#66BB6A]/30 text-xs text-[#66BB6A] font-bold flex items-center gap-2">
              <i className="fas fa-check-circle"></i>
              <span>¡Suscrito con éxito!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                placeholder="tu.correo@ejemplo.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#2A1C15] text-xs text-[#F8F1E9] border border-[rgba(184,151,120,0.3)] focus:border-[#B89778] outline-none"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-[#B89778] text-[#2A1C15] font-bold text-xs uppercase tracking-wider hover:bg-[#D4B99F] transition-all shadow-md cursor-pointer"
              >
                Suscribirme
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-[rgba(184,151,120,0.15)] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8B7B6E] gap-3">
        <span>© 2026 Café Vistro HN. Cosechado y tostado con orgullo en Honduras.</span>
        <span className="flex items-center gap-1.5 text-[#B89778]">
          <i className="fas fa-leaf text-xs"></i> Café de Especialidad Sostenible
        </span>
      </div>
    </footer>
  );
};
