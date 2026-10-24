import React from 'react';
import { useStore } from '../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      id="toast-container"
      className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-3 max-w-sm pointer-events-auto"
      role="region"
      aria-label="Notificaciones"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';

        let borderColor = 'border-l-[#B89778]';
        let iconClass = 'fa-info-circle text-[#B89778]';
        if (isError) {
          borderColor = 'border-l-[#E53935]';
          iconClass = 'fa-times-circle text-[#E53935]';
        } else if (isSuccess) {
          borderColor = 'border-l-[#43A047]';
          iconClass = 'fa-check-circle text-[#43A047]';
        }

        return (
          <div
            key={toast.id}
            className={`toast-item bg-[#4A372E] text-[#F8F1E9] px-5 py-4 rounded-xl shadow-2xl border-l-[6px] ${borderColor} flex items-center justify-between gap-3 text-sm font-medium border border-[rgba(168,135,107,0.2)]`}
          >
            <div className="flex items-center gap-3">
              <i className={`fas ${iconClass} text-lg`} aria-hidden="true"></i>
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#8B7B6E] hover:text-[#F8F1E9] transition-colors p-1"
              aria-label="Cerrar notificación"
            >
              <i className="fas fa-times text-xs"></i>
            </button>
          </div>
        );
      })}
    </div>
  );
};
