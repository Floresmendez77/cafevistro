import React from 'react';
import { useStore } from '../context/StoreContext';

export const SettingsModal: React.FC = () => {
  const { isSettingsModalOpen, setIsSettingsModalOpen, theme, setTheme, showToast } = useStore();

  if (!isSettingsModalOpen) return null;

  const handleSelectTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    showToast(`Tema cambiado a ${newTheme === 'dark' ? 'Oscuro' : 'Claro'}.`, 'info');
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={() => setIsSettingsModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div
        className="relative w-full max-w-md bg-[#2A1C15] text-[#F8F1E9] p-8 rounded-2xl border border-[rgba(168,135,107,0.3)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsSettingsModalOpen(false)}
          className="absolute top-5 right-6 text-3xl text-[#F8F1E9] hover:text-[#B89778] transition-transform hover:rotate-90"
          aria-label="Cerrar modal"
        >
          &times;
        </button>

        <div className="border-b border-[rgba(168,135,107,0.25)] pb-4 mb-6">
          <h2 id="settings-modal-title" className="text-2xl font-bold font-serif text-[#B89778]">
            <i className="fas fa-sliders-h mr-2"></i> Ajustes
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium text-[#8B7B6E] mb-3">
              Elige tu tema preferido para la interfaz pública:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSelectTheme('dark')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all font-semibold ${
                  theme === 'dark'
                    ? 'bg-[#B89778] text-[#2A1C15] border-[#B89778] shadow-md'
                    : 'bg-[#4A372E] text-[#F8F1E9] border-[rgba(168,135,107,0.3)] hover:border-[#B89778]'
                }`}
              >
                <i className="fas fa-moon"></i> Oscuro
              </button>
              <button
                type="button"
                onClick={() => handleSelectTheme('light')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border transition-all font-semibold ${
                  theme === 'light'
                    ? 'bg-[#B89778] text-[#2A1C15] border-[#B89778] shadow-md'
                    : 'bg-[#4A372E] text-[#F8F1E9] border-[rgba(168,135,107,0.3)] hover:border-[#B89778]'
                }`}
              >
                <i className="fas fa-sun"></i> Claro
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[rgba(168,135,107,0.2)] text-xs text-[#8B7B6E] flex items-center justify-between">
            <span>Eco Tienda HN v2.0</span>
            <span className="flex items-center gap-1 text-[#B89778]">
              <i className="fas fa-leaf"></i> Sostenible
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
