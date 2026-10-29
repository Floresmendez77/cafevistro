import React from 'react';
import { BlogPost } from '../../types';

interface DashboardBlogProps {
  blogPosts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

export const DashboardBlog: React.FC<DashboardBlogProps> = ({
  blogPosts,
  onSelectPost,
}) => {
  return (
    <section className="space-y-8 animate-fade-in" id="blog">
      <div>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F8F1E9] flex items-center gap-3">
          <i className="fas fa-book-open text-[#B89778]"></i> Guía Barista & Blog de Café
        </h2>
        <p className="text-xs md:text-sm text-[#D4B99F] mt-1">
          Aprende sobre orígenes hondureños, técnicas de extracción y molienda artesanal
        </p>
      </div>

      <div id="blog-posts-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="blog-post bg-[#382820] p-6 rounded-2xl border border-[rgba(184,151,120,0.25)] shadow-xl flex flex-col justify-between hover:-translate-y-1 transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[#8B7B6E] mb-3">
                <span className="bg-[#B89778]/20 text-[#B89778] font-bold px-2.5 py-0.5 rounded-full">
                  {post.tag}
                </span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#B89778] mb-3 leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-[#F8F1E9]/90 leading-relaxed line-clamp-3">
                {post.resumen}
              </p>
            </div>
            <button
              onClick={() => onSelectPost(post)}
              className="mt-6 flex items-center gap-2 text-xs font-bold text-[#B89778] hover:text-[#F8F1E9] transition-colors cursor-pointer"
            >
              <span>Leer artículo completo</span>
              <i className="fas fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
