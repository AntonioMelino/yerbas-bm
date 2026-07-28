// Tarjeta de producto del catálogo: imagen, nombre, descripción,
// categoría, precio y badge de destacado. Al hacer click abre el
// ProductModal con el detalle (vía uiStore).

import type { Product } from '../types'
import { formatPrice } from '../utils/format'
import { useUiStore } from '../stores/uiStore'
import { useCartStore } from '../stores/cartStore'

interface ProductCardProps {
  /** Producto tal como lo devuelve GET /api/products. */
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const openProductModal = useUiStore((state) => state.openProductModal)
  const showToast = useUiStore((state) => state.showToast)
  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = (event: React.MouseEvent) => {
    event.stopPropagation()
    addItem(product, 1)
    showToast('Agregado al carrito 🧉')
  }

  return (
    <article
      onClick={() => openProductModal(product)}
      className="card-lift group cursor-pointer bg-forest/50 border border-olive/50 rounded-2xl overflow-hidden"
    >
      <div className="img-zoom relative aspect-square overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-night text-cream/30 text-sm">
            Sin imagen
          </div>
        )}
        {product.categoryName && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-ink/70 backdrop-blur border border-olive/50 text-lime text-[9px] sm:text-[10px] uppercase tracking-widest px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
            {product.categoryName}
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-lime text-ink text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-1 sm:px-3 sm:py-1.5 rounded-full">
            Destacado
          </span>
        )}
      </div>

      <div className="p-3 sm:p-5">
        <h3 className="font-display font-bold text-sm sm:text-base leading-snug mb-1 text-cream group-hover:text-lime transition line-clamp-2">
          {product.name}
        </h3>
        <p className="hidden sm:block text-xs text-cream/50 font-light line-clamp-2 mb-4">
          {product.description ?? ''}
        </p>
        <div className="flex items-center justify-between mt-2 sm:mt-0">
          <span className="font-display font-bold text-lg sm:text-xl text-lime">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            onClick={handleAdd}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-yerba hover:bg-lime hover:text-ink border border-olive/50 flex items-center justify-center transition-all duration-300"
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}
