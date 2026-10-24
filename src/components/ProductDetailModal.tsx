import React, { useState } from 'react';
import { Product, ProductVariant } from '../types';
import { useStore } from '../context/StoreContext';
import { formatLempiras } from '../utils/formatCurrency';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectProduct: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onSelectProduct,
}) => {
  const { addToCart, wishlist, toggleWishlist, products } = useStore();

  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(undefined);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  // Synchronize initial image & variant whenever product changes
  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.imagen_url);
      setSelectedVariant(product.variantes ? product.variantes[0] : undefined);
      setQuantity(1);
      setIsAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const isWishlisted = wishlist.includes(product.id);
  const unitPrice = product.precio + (selectedVariant ? selectedVariant.precio_adicional : 0);

  const galleryImages = [
    product.imagen_url,
    ...(product.gallery || [
      '/cafe_marcala.jpg',
      '/prensa_francesa.jpg',
      '/molino_manual.jpg',
    ]).filter((img) => img !== product.imagen_url).slice(0, 2),
  ];

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.categoria === product.categoria || p.categoria.includes('Café')))
    .slice(0, 3);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
    >
      <div
        className="relative w-full max-w-3xl bg-[#2A1C15] text-[#F8F1E9] p-6 sm:p-8 rounded-3xl border border-[rgba(184,151,120,0.35)] shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-2xl text-[#D4B99F] hover:text-[#B89778] hover:rotate-90 transition-transform"
          aria-label="Cerrar modal de producto"
        >
          &times;
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Gallery Column */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-black/30 border border-[rgba(184,151,120,0.25)]">
              <img
                src={selectedImage || product.imagen_url}
                alt={product.nombre}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isWishlisted
                    ? 'bg-red-500 text-white shadow-lg animate-badge-pop'
                    : 'bg-black/60 text-[#F8F1E9] hover:text-red-400'
                }`}
                aria-label="Añadir a lista de deseos"
              >
                <i className={`fas fa-heart text-base ${isWishlisted ? 'text-white' : ''}`}></i>
              </button>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-[#B89778] scale-105 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Column */}
          <div className="space-y-4 text-left">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#B89778] px-2.5 py-0.5 rounded-full bg-[#B89778]/15 border border-[#B89778]/30">
                {product.categoria}
              </span>
              <h2 id="product-detail-title" className="text-2xl font-serif font-bold text-[#F8F1E9] mt-2 mb-1">
                {product.nombre}
              </h2>
              <p className="text-2xl font-serif font-bold text-[#B89778]">
                {formatLempiras(unitPrice)}
              </p>
            </div>

            {/* Stock indicator badge */}
            <div className="flex items-center gap-2">
              {product.stock <= 25 ? (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
                  <i className="fas fa-fire-alt text-xs"></i>
                  ¡Solo quedan {product.stock} unidades en bodega!
                </span>
              ) : (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/20 text-[#66BB6A] border border-green-500/30 flex items-center gap-1.5">
                  <i className="fas fa-check-circle text-xs"></i>
                  En inventario ({product.stock} disponibles)
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#D4B99F] leading-relaxed">
              {product.descripcion}
            </p>

            {product.eco_impact && (
              <div className="p-3 rounded-xl bg-[#382820] border border-[rgba(184,151,120,0.25)] text-xs text-[#66BB6A] flex items-center gap-2">
                <i className="fas fa-leaf text-sm shrink-0"></i>
                <span>{product.eco_impact}</span>
              </div>
            )}

            {/* Variants Selector */}
            {product.variantes && product.variantes.length > 0 && (
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#B89778] block mb-1.5">
                  Selecciona Molienda o Presentación:
                </label>
                <div className="space-y-1.5">
                  {product.variantes.map((v) => (
                    <button
                      key={v.nombre_variante}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between border transition-all ${
                        selectedVariant?.nombre_variante === v.nombre_variante
                          ? 'bg-[#B89778] text-[#2A1C15] border-[#B89778] font-bold shadow-sm'
                          : 'bg-[#382820] text-[#D4B99F] border-[rgba(184,151,120,0.2)] hover:border-[#B89778]'
                      }`}
                    >
                      <span>{v.nombre_variante}</span>
                      <span>
                        {v.precio_adicional === 0
                          ? formatLempiras(product.precio)
                          : `+ ${formatLempiras(v.precio_adicional)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper and Add To Cart */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 p-1 rounded-xl bg-[#382820] border border-[rgba(184,151,120,0.25)]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-[#2A1C15] text-[#F8F1E9] font-bold text-sm hover:bg-[#B89778] hover:text-[#2A1C15] transition-colors"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-[#2A1C15] text-[#F8F1E9] font-bold text-sm hover:bg-[#B89778] hover:text-[#2A1C15] transition-colors"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isAdded
                    ? 'bg-[#66BB6A] text-[#1C120C] shadow-green-500/30'
                    : 'bg-gradient-to-r from-[#B89778] to-[#D4B99F] text-[#2A1C15] hover:brightness-105'
                }`}
              >
                {isAdded ? (
                  <>
                    <i className="fas fa-check text-sm animate-bounce"></i>
                    <span>¡Añadido al Carrito!</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-cart-plus text-sm"></i>
                    <span>Añadir al Carrito</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-6 border-t border-[rgba(184,151,120,0.2)]">
            <h3 className="font-serif font-bold text-lg text-[#B89778] mb-4">
              Maridajes y Productos Relacionados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedProducts.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectProduct(rel)}
                  className="p-3 rounded-2xl bg-[#382820] border border-[rgba(184,151,120,0.2)] hover:border-[#B89778] cursor-pointer flex items-center gap-3 transition-all hover:-translate-y-1"
                >
                  <img
                    src={rel.imagen_url}
                    alt={rel.nombre}
                    className="w-14 h-14 object-cover rounded-xl"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-[#F8F1E9] truncate">{rel.nombre}</h4>
                    <p className="text-xs font-serif font-bold text-[#B89778] mt-0.5">
                      {formatLempiras(rel.precio)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
