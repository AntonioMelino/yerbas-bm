// Tarjeta de producto del catálogo: imagen (URL pública de Supabase, se usa
// directo), nombre, categoría, precio y badge de destacado.
// Al hacer click abre el ProductModal con el detalle (vía uiStore).

import type { Product } from '../types'
import { formatPrice } from '../utils/format'
import { useUiStore } from '../stores/uiStore'

interface ProductCardProps {
  /** Producto tal como lo devuelve GET /api/products. */
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const openProductModal = useUiStore((state) => state.openProductModal)

  return (
    <article
      onClick={() => openProductModal(product)}
      className="group cursor-pointer overflow-hidden rounded-xl border border-yerba-700 bg-yerba-800 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/40"
    >
      <div className="relative aspect-square overflow-hidden bg-yerba-900">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-yerba-600">
            Sin imagen
          </div>
        )}
        {product.isFeatured && (
          <span className="absolute left-2 top-2 rounded-full bg-yerba-400 px-2 py-0.5 text-xs font-semibold text-yerba-950">
            Destacado
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 p-4">
        {product.categoryName && (
          <span className="text-xs uppercase tracking-wide text-yerba-500">
            {product.categoryName}
          </span>
        )}
        <h3 className="font-display text-lg text-yerba-300">{product.name}</h3>
        <p className="mt-1 text-lg font-semibold text-yerba-400">
          {formatPrice(product.price)}
        </p>
      </div>
    </article>
  )
}
