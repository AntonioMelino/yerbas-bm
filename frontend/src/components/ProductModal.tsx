// Modal de detalle de producto: imagen grande, nombre, descripción,
// precio, selector de cantidad y botón "Agregar al carrito".
// El producto a mostrar lo define uiStore.selectedProduct; se monta en
// PublicLayout y lo abre ProductCard.

import { useEffect, useState } from 'react'
import { useCartStore } from '../stores/cartStore'
import { useUiStore } from '../stores/uiStore'
import { formatPrice } from '../utils/format'

export default function ProductModal() {
  const { selectedProduct, closeProductModal, openCart } = useUiStore()
  const addItem = useCartStore((state) => state.addItem)
  const showToast = useUiStore((state) => state.showToast)
  const [quantity, setQuantity] = useState(1)

  // Resetea la cantidad cada vez que se abre el modal con otro producto.
  useEffect(() => {
    if (selectedProduct) setQuantity(1)
  }, [selectedProduct])

  if (!selectedProduct) return null

  const handleAdd = () => {
    addItem(selectedProduct, quantity)
    showToast('Agregado al carrito 🧉')
    closeProductModal()
    openCart()
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm"
      onClick={closeProductModal}
      role="dialog"
      aria-modal="true"
      aria-label={selectedProduct.name}
    >
      <div
        className="modal-box relative bg-night border border-olive/60 rounded-3xl overflow-hidden max-w-3xl w-full grid md:grid-cols-2 shadow-2xl opacity-100 scale-100"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="img-zoom aspect-square md:aspect-auto">
          {selectedProduct.imageUrl ? (
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-night text-cream/30">
              Sin imagen
            </div>
          )}
        </div>

        <div className="p-7 flex flex-col">
          {selectedProduct.categoryName && (
            <span className="text-[11px] uppercase tracking-widest text-gold mb-2">
              {selectedProduct.categoryName}
            </span>
          )}
          <h3 className="font-display font-bold text-2xl text-cream mb-3">
            {selectedProduct.name}
          </h3>
          <p className="text-sm text-cream/60 font-light leading-relaxed mb-6">
            {selectedProduct.description ?? ''}
          </p>
          <p className="font-display font-bold text-3xl text-lime mb-6">
            {formatPrice(selectedProduct.price)}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-olive/60 rounded-full">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:text-lime transition text-lg text-cream"
                aria-label="Restar unidad"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold text-cream">{quantity}</span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) =>
                    selectedProduct.stock > 0
                      ? Math.min(selectedProduct.stock, q + 1)
                      : q + 1,
                  )
                }
                className="w-10 h-10 flex items-center justify-center hover:text-lime transition text-lg text-cream"
                aria-label="Sumar unidad"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={selectedProduct.stock === 0}
            className="mt-auto bg-lime text-ink font-bold py-3.5 rounded-full hover:bg-gold hover:text-cream transition flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
              />
            </svg>
            Agregar al carrito
          </button>
        </div>

        <button
          type="button"
          onClick={closeProductModal}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-ink/70 border border-olive/60 flex items-center justify-center hover:border-gold hover:text-lime transition text-cream"
          aria-label="Cerrar"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
