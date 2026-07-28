// Modal de detalle de producto (CONTEXTO.md sección 7 — "al hacer click en un
// producto se abre un modal, no una página aparte"): imagen grande, nombre,
// descripción, precio, selector de cantidad y botón "Agregar al carrito".
// El producto a mostrar lo define uiStore.selectedProduct; se monta en
// PublicLayout y lo abre ProductCard.

import { useEffect, useState } from 'react'
import { useCartStore } from '../stores/cartStore'
import { useUiStore } from '../stores/uiStore'
import { formatPrice } from '../utils/format'

export default function ProductModal() {
  const { selectedProduct, closeProductModal, openCart } = useUiStore()
  const addItem = useCartStore((state) => state.addItem)
  const [quantity, setQuantity] = useState(1)

  // Resetea la cantidad cada vez que se abre el modal con otro producto.
  useEffect(() => {
    if (selectedProduct) setQuantity(1)
  }, [selectedProduct])

  if (!selectedProduct) return null

  const handleAdd = () => {
    addItem(selectedProduct, quantity)
    closeProductModal()
    openCart()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={closeProductModal}
      role="dialog"
      aria-modal="true"
      aria-label={selectedProduct.name}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-xl border border-yerba-700 bg-yerba-900 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative aspect-square bg-yerba-950 sm:aspect-video">
          {selectedProduct.imageUrl ? (
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-yerba-600">
              Sin imagen
            </div>
          )}
          <button
            type="button"
            onClick={closeProductModal}
            aria-label="Cerrar"
            className="absolute right-3 top-3 rounded-full bg-yerba-950/70 p-1.5 text-yerba-300 transition-colors hover:text-yerba-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          {selectedProduct.categoryName && (
            <span className="text-xs uppercase tracking-wide text-yerba-500">
              {selectedProduct.categoryName}
            </span>
          )}
          <h2 className="mt-1 font-display text-2xl text-yerba-300">
            {selectedProduct.name}
          </h2>
          {selectedProduct.description && (
            <p className="mt-2 text-sm text-yerba-400">{selectedProduct.description}</p>
          )}
          <p className="mt-3 text-xl font-bold text-yerba-400">
            {formatPrice(selectedProduct.price)}
          </p>
          {selectedProduct.stock === 0 && (
            <p className="mt-1 text-sm text-red-400">Sin stock por el momento.</p>
          )}

          <div className="mt-4 flex items-center gap-3">
            {/* Selector de cantidad */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Restar unidad"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-yerba-700 text-yerba-300 transition-colors hover:bg-yerba-800"
              >
                −
              </button>
              <span className="w-8 text-center text-yerba-300">{quantity}</span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) =>
                    selectedProduct.stock > 0 ? Math.min(selectedProduct.stock, q + 1) : q + 1,
                  )
                }
                aria-label="Sumar unidad"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-yerba-700 text-yerba-300 transition-colors hover:bg-yerba-800"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={selectedProduct.stock === 0}
              className="flex-1 rounded-lg bg-yerba-400 py-2.5 font-semibold text-yerba-950 transition-colors hover:bg-yerba-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
