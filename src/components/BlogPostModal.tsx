import React from 'react';
import { useStore } from '../context/StoreContext';

export const BlogPostModal: React.FC = () => {
  const { selectedBlogPost, setSelectedBlogPost } = useStore();

  if (!selectedBlogPost) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={() => setSelectedBlogPost(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-[#2A1C15] text-[#F8F1E9] p-8 md:p-10 rounded-2xl border border-[rgba(168,135,107,0.3)] shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setSelectedBlogPost(null)}
          className="absolute top-6 right-6 text-3xl text-[#F8F1E9] hover:text-[#B89778] transition-transform hover:rotate-90"
          aria-label="Cerrar artículo"
        >
          &times;
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs uppercase tracking-wider font-bold bg-[#B89778]/20 text-[#B89778] px-3 py-1 rounded-full border border-[#B89778]/30">
              {selectedBlogPost.tag}
            </span>
            <span className="text-xs text-[#8B7B6E] flex items-center gap-1">
              <i className="far fa-clock"></i> {selectedBlogPost.readTime}
            </span>
          </div>
          <h2 id="blog-modal-title" className="text-2xl md:text-3xl font-bold font-serif text-[#B89778] leading-tight">
            {selectedBlogPost.title}
          </h2>
        </div>

        <div className="prose prose-invert max-w-none text-base leading-relaxed text-[#F8F1E9] space-y-4">
          <p>{selectedBlogPost.content}</p>
          <div className="p-4 rounded-xl bg-[#4A372E] border border-[rgba(168,135,107,0.2)] text-sm text-[#D4B99F] flex items-start gap-3">
            <i className="fas fa-seedling text-[#B89778] text-xl mt-0.5"></i>
            <div>
              <strong className="text-[#F8F1E9] block mb-0.5">Consejo Eco Tienda:</strong>
              Cada elección cuenta. Al sustituir artículos desechables por opciones duraderas, reduces la generación de residuos en nuestro bello país.
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-[rgba(168,135,107,0.2)] flex justify-end">
          <button
            onClick={() => setSelectedBlogPost(null)}
            className="px-6 py-2.5 bg-[#B89778] text-[#2A1C15] font-bold rounded-xl hover:bg-[#D4B99F] transition-all shadow-md"
          >
            Cerrar Lectura
          </button>
        </div>
      </div>
    </div>
  );
};
