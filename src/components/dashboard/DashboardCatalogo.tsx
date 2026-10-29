import React from 'react';
import { Product, ProductVariant } from '../../types';
import { formatLempiras } from '../../utils/formatCurrency';

interface DashboardCatalogoProps {
  products: Product[];
  filteredProducts: Product[];
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortOption: string;
  setSortOption: (sort: string) => void;
  filterWishlistOnly: boolean;
  setFilterWishlistOnly: (val: boolean) => void;
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  selectedVariants: Record<number, ProductVariant>;
  onVariantChange: (productId: number, variant: ProductVariant) => void;
  productQuantities: Record<number, number>;
  onQuantityChange: (productId: number, delta: number) => void;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  addedFeedback: Record<number, boolean>;
  onSelectDetailProduct: (product: Product) => void;
}

export const DashboardCatalogo: React.FC<DashboardCatalogoProps> = ({
  filteredProducts,
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  sortOption,
  setSortOption,
  filterWishlistOnly,
  setFilterWishlistOnly,
  wishlist,
  toggleWishlist,
  selectedVariants,
  onVariantChange,
  productQuantities,
  onQuantityChange,
  onAddToCart,
  addedFeedback,
  onSelectDetailProduct,
}) => {
  return (
    <section className="space-y-8 animate-fade-in" id="catalogo">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#F8F1E9] flex items-center gap-3">
            <i className="fas fa-coffee text-[#B89778]"></i> Catálogo de Especialidad
          </h2>
          <p className="text-xs md:text-sm text-[#D4B99F] mt-1">
            Granos de altura, métodos de goteo manuales y herramientas de barista profesional
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Live Search bar */}
          <div className="relative w-full sm:w-64">
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8B7B6E]"></i>
            <input
              type="text"
              placeholder="Buscar café o métodos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#382820] text-xs text-[#F8F1E9] border border-[rgba(184,151,120,0.3)] focus:border-[#B89778] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8B7B6E] hover:text-[#F8F1E9] cursor-pointer"
              >
                &times;
              </button>
            )}
          </div>

          {/* Sort Selector Dropdown */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-[#382820] text-xs text-[#F8F1E9] border border-[rgba(184,151,120,0.3)] focus:border-[#B89778] outline-none cursor-pointer"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills & Wishlist Toggle */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[rgba(184,151,120,0.2)]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              onSelectCategory(cat);
              setFilterWishlistOnly(false);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat && !filterWishlistOnly
                ? 'bg-[#B89778] text-[#2A1C15] shadow-md scale-102'
                : 'bg-[#382820] text-[#D4B99F] border border-[rgba(184,151,120,0.25)] hover:border-[#B89778]'
            }`}
          >
            {cat}
          </button>
        ))}

        <button
          onClick={() => setFilterWishlistOnly(!filterWishlistOnly)}
          className={`ml-auto px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 cursor-pointer ${
            filterWishlistOnly
              ? 'bg-red-500/20 text-red-300 border-red-500/50'
              : 'bg-[#382820] text-[#D4B99F] border-[rgba(184,151,120,0.25)] hover:text-red-400'
          }`}
        >
          <i className="fas fa-heart text-red-400"></i>
          <span>Solo Favoritos ({wishlist.length})</span>
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#382820] rounded-2xl p-12 text-center border border-[rgba(184,151,120,0.25)]">
          <i className="fas fa-coffee text-5xl text-[#8B7B6E] mb-4 block"></i>
          <h3 className="font-serif text-xl text-[#F8F1E9] font-bold">No se encontraron productos</h3>
          <p className="text-xs text-[#D4B99F] mt-2">
            Intenta con otro término de búsqueda o limpia los filtros de categoría.
          </p>
          <button
            onClick={() => {
              onSelectCategory('Todos');
              setSearchQuery('');
              setFilterWishlistOnly(false);
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[#B89778] text-[#2A1C15] font-bold text-xs cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const activeVariant = selectedVariants[product.id] || (product.variantes ? product.variantes[0] : undefined);
            const unitPrice = product.precio + (activeVariant ? activeVariant.precio_adicional : 0);
            const isAdded = !!addedFeedback[product.id];
            const isWishlisted = wishlist.includes(product.id);

            return (
              <div
                key={product.id}
                className="product-card group bg-[#382820] rounded-2xl overflow-hidden border border-[rgba(184,151,120,0.25)] shadow-xl hover:shadow-2xl hover:border-[#B89778] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div
                    className="relative h-56 overflow-hidden cursor-pointer"
                    onClick={() => onSelectDetailProduct(product)}
                  >
                    <img
                      src={product.imagen_url}
                      alt={product.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <span className="text-xs text-white font-bold flex items-center gap-1.5">
                        <i className="fas fa-eye text-[#B89778]"></i> Ver detalles completos
                      </span>
                    </div>

                    <span className="absolute top-3 left-3 bg-[#1C120C]/80 backdrop-blur-sm text-[10px] uppercase tracking-wider text-[#D4B99F] font-bold px-2.5 py-1 rounded-md border border-[rgba(184,151,120,0.3)]">
                      {product.categoria}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isWishlisted
                          ? 'bg-red-500 text-white shadow-lg'
                          : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/80'
                      }`}
                      title={isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      <i className="fas fa-heart text-xs"></i>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3
                      onClick={() => onSelectDetailProduct(product)}
                      className="font-serif font-bold text-base text-[#F8F1E9] line-clamp-1 group-hover:text-[#B89778] transition-colors cursor-pointer"
                    >
                      {product.nombre}
                    </h3>
                    <p className="text-xs text-[#D4B99F]/80 mt-1.5 line-clamp-2 leading-relaxed">
                      {product.descripcion}
                    </p>

                    {/* Variant Selector if present */}
                    {product.variantes && product.variantes.length > 0 && (
                      <div className="mt-3">
                        <label className="text-[10px] uppercase font-bold text-[#8B7B6E] block mb-1">
                          Presentación:
                        </label>
                        <select
                          value={activeVariant?.nombre_variante}
                          onChange={(e) => {
                            const found = product.variantes?.find((v) => v.nombre_variante === e.target.value);
                            if (found) onVariantChange(product.id, found);
                          }}
                          className="w-full text-xs bg-[#241711] text-[#F8F1E9] px-2.5 py-1.5 rounded-lg border border-[rgba(184,151,120,0.2)] focus:border-[#B89778] outline-none cursor-pointer"
                        >
                          {product.variantes.map((v) => (
                            <option key={v.nombre_variante} value={v.nombre_variante}>
                              {v.nombre_variante} {v.precio_adicional > 0 ? `(+${formatLempiras(v.precio_adicional)})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer with Price and Add to Cart */}
                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between mb-3 pt-3 border-t border-[rgba(184,151,120,0.15)]">
                    <div>
                      <span className="text-[10px] text-[#8B7B6E] block">Precio:</span>
                      <span className="font-serif text-lg font-bold text-[#B89778]">
                        {formatLempiras(unitPrice)}
                      </span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center bg-[#241711] border border-[rgba(184,151,120,0.25)] rounded-lg">
                      <button
                        onClick={() => onQuantityChange(product.id, -1)}
                        className="px-2 py-1 text-xs text-[#D4B99F] hover:text-white cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-bold text-[#F8F1E9]">
                        {productQuantities[product.id] || 1}
                      </span>
                      <button
                        onClick={() => onQuantityChange(product.id, 1)}
                        className="px-2 py-1 text-xs text-[#D4B99F] hover:text-white cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={(e) => onAddToCart(product, e)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] hover:shadow-lg hover:scale-101'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <i className="fas fa-check"></i>
                        <span>¡Agregado al Carrito!</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-shopping-bag"></i>
                        <span>Agregar al Carrito</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

