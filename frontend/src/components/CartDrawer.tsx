// Drawer lateral del carrito (se desliza desde la derecha, CONTEXTO.md
// sección 7): lista de ítems con modificación de cantidades y eliminación,
// campo opcional para el nombre del cliente y el botón "Hacer pedido por
// WhatsApp" que abre wa.me con el mensaje ya armado (sección 8).
// Se monta en PublicLayout y su visibilidad la maneja uiStore.

import { useState } from 'react'
import { useCartStore } from '../stores/cartStore'
import { useUiStore } from '../stores/uiStore'
import { buildWhatsAppUrl } from '../utils/whatsapp'
import { formatPrice } from '../utils/format'

export default function CartDrawer() {
  const { items, setQuantity, removeItem, clear, totalPrice } = useCartStore()
  const { isCartOpen, closeCart } = useUiStore()
  const [customerName, setCustomerName] = useState('')

  const handleOrder = () => {
    if (items.length === 0) return
    window.open(buildWhatsAppUrl(items, customerName), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Fondo oscuro: click para cerrar */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Panel deslizante */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-yerba-700 bg-yerba-900 shadow-2xl transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between border-b border-yerba-700 px-4 py-3">
          <h2 className="font-display text-xl text-yerba-300">Tu pedido</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="text-yerba-400 transition-colors hover:text-yerba-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <p className="flex flex-1 items-center justify-center px-6 text-center text-yerba-500">
            El carrito está vacío. Agregá productos desde el catálogo.
          </p>
        ) : (
          <>
            {/* Lista de ítems */}
            <ul className="flex-1 divide-y divide-yerba-700 overflow-y-auto px-4">
              {items.map((item) => (
                <li key={item.product.id} className="flex gap-3 py-4">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-yerba-800 text-xs text-yerba-600">
                      —
                    </div>
                  )}

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm text-yerba-300">{item.product.name}</span>
                      <button
                        type="button"
                        onClick={() => removeItem(item.product.id)}
                        aria-label={`Quitar ${item.product.name}`}
                        className="text-yerba-600 transition-colors hover:text-red-400"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          className="h-4 w-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      {/* Selector de cantidad */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setQuantity(item.product.id, item.quantity - 1)}
                          aria-label="Restar unidad"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-yerba-700 text-yerba-300 transition-colors hover:bg-yerba-800"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm text-yerba-300">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                          aria-label="Sumar unidad"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-yerba-700 text-yerba-300 transition-colors hover:bg-yerba-800"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-yerba-400">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Pie: nombre, total y acciones */}
            <div className="border-t border-yerba-700 px-4 py-4">
              <label className="block text-xs text-yerba-500" htmlFor="customer-name">
                Tu nombre (opcional)
              </label>
              <input
                id="customer-name"
                type="text"
                maxLength={100}
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="Para identificar tu pedido"
                className="mt-1 w-full rounded-lg border border-yerba-700 bg-yerba-950 px-3 py-2 text-sm text-yerba-300 placeholder:text-yerba-600 focus:border-yerba-500 focus:outline-none"
              />

              <div className="mt-3 flex items-center justify-between">
                <span className="text-yerba-400">Total</span>
                <span className="text-lg font-bold text-yerba-300">
                  {formatPrice(totalPrice())}
                </span>
              </div>

              {/* Verde estilo WhatsApp, prominente (CONTEXTO.md sección 7) */}
              <button
                type="button"
                onClick={handleOrder}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 font-semibold text-white transition-colors hover:bg-[#1fb857]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Hacer pedido por WhatsApp
              </button>

              <button
                type="button"
                onClick={clear}
                className="mt-2 w-full rounded-lg border border-yerba-700 py-2 text-sm text-yerba-400 transition-colors hover:bg-yerba-800"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
