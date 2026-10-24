import React from 'react';
import { useStore } from '../context/StoreContext';

export const LegalModal: React.FC = () => {
  const { isLegalModalOpen, setIsLegalModalOpen } = useStore();

  if (!isLegalModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={() => setIsLegalModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-[#2A1C15] text-[#F8F1E9] p-8 md:p-10 rounded-2xl border border-[rgba(168,135,107,0.3)] shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsLegalModalOpen(false)}
          className="absolute top-6 right-6 text-3xl text-[#F8F1E9] hover:text-[#B89778] transition-transform hover:rotate-90"
          aria-label="Cerrar modal"
        >
          &times;
        </button>

        <div className="border-b border-[rgba(168,135,107,0.25)] pb-4 mb-6">
          <h2 id="legal-modal-title" className="text-2xl md:text-3xl font-bold font-serif text-[#B89778]">
            Políticas y Requisitos Legales
          </h2>
          <p className="text-xs text-[#8B7B6E] mt-1">Transparencia y compromiso con nuestros clientes en Honduras</p>
        </div>

        <div className="space-y-6 text-[#F8F1E9]">
          <div className="border-b border-[rgba(168,135,107,0.2)] pb-4">
            <h4 className="font-serif text-lg text-[#B89778] mb-1 flex items-center gap-2">
              <i className="fas fa-truck text-base"></i> Envío de Productos
            </h4>
            <p className="text-sm leading-relaxed text-[#D4B99F]">
              Se realiza mediante paqueterías confiables con seguimiento disponible a todo el territorio nacional hondureño.
              Tiempo estimado de entrega en Tegucigalpa y San Pedro Sula: 24 a 48 horas laborables.
            </p>
          </div>

          <div className="border-b border-[rgba(168,135,107,0.2)] pb-4">
            <h4 className="font-serif text-lg text-[#B89778] mb-1 flex items-center gap-2">
              <i className="fas fa-exchange-alt text-base"></i> Devolución y Cambio
            </h4>
            <p className="text-sm leading-relaxed text-[#D4B99F]">
              Garantía de hasta 15 días calendario a partir de la recepción con debida justificación y con el producto sin uso en su embalaje ecológico original.
            </p>
          </div>

          <div className="border-b border-[rgba(168,135,107,0.2)] pb-4">
            <h4 className="font-serif text-lg text-[#B89778] mb-1 flex items-center gap-2">
              <i className="fas fa-shield-alt text-base"></i> Seguridad y Privacidad
            </h4>
            <p className="text-sm leading-relaxed text-[#D4B99F]">
              Contamos con certificado SSL para cifrar toda la información. Tus datos personales y direcciones no son compartidos ni comercializados a terceros bajo ninguna circunstancia.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg text-[#B89778] mb-2 flex items-center gap-2">
              <i className="fas fa-landmark text-base"></i> Requisitos Legales en Honduras
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-sm text-[#D4B99F]">
              <li>Registro Tributario Nacional (RTN) emitido por el SAR.</li>
              <li>Escritura pública de constitución mercantil ante notario.</li>
              <li>Licencia municipal y registro en la Cámara de Comercio correspondiente.</li>
              <li>Facturación electrónica autorizada conforme al régimen de facturación de Honduras.</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[rgba(168,135,107,0.25)] flex justify-end">
          <button
            onClick={() => setIsLegalModalOpen(false)}
            className="px-6 py-2.5 bg-[#B89778] text-[#2A1C15] font-bold rounded-xl hover:bg-[#D4B99F] transition-all shadow-md"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
