// Drawer lateral del carrito (se desliza desde la derecha): lista de ítems
// con modificación de cantidades, campo opcional para el nombre del cliente
// y el botón "Hacer pedido por WhatsApp" que abre wa.me con el mensaje
// ya armado. Se monta en PublicLayout y su visibilidad la maneja uiStore.

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
        className={`overlay fixed inset-0 z-[70] bg-ink/70 backdrop-blur-sm transition-opacity duration-400 ${
          isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Panel deslizante */}
      <aside
        className={`drawer fixed top-0 right-0 h-full w-full sm:w-[430px] bg-night border-l border-olive/50 z-[80] flex flex-col shadow-2xl transition-transform duration-500 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Carrito de compras"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-olive/40">
          <div>
            <h3 className="font-display font-bold text-xl text-cream">Tu pedido</h3>
            <p className="text-xs text-cream/50 mt-0.5">Se envía por WhatsApp</p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="w-9 h-9 rounded-full border border-olive/60 flex items-center justify-center hover:border-gold hover:text-lime transition text-cream"
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

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 text-cream/40 font-light">
              <p className="text-4xl mb-3">🧉</p>
              <p>
                Tu carrito está vacío.
                <br />
                ¡Sumá algo rico para el mate!
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 bg-forest/50 border border-olive/40 rounded-xl p-3.5"
              >
                {item.product.imageUrl ? (
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-lg object-cover border border-olive/40"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-night flex items-center justify-center text-cream/30 text-xs">
                    —
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-cream truncate">{item.product.name}</p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      aria-label={`Quitar ${item.product.name}`}
                      className="text-cream/40 hover:text-lime transition"
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
                  <p className="text-xs text-cream/50">{formatPrice(item.product.price)} c/u</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2.5 border border-olive/50 rounded-full px-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 text-cream/70 hover:text-lime"
                        aria-label="Restar unidad"
                      >
                        −
                      </button>
                      <span className="text-sm font-semibold text-cream w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 text-cream/70 hover:text-lime"
                        aria-label="Sumar unidad"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-bold text-lime">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-olive/40 px-6 py-5 space-y-4 bg-forest/40">
          <input
            id="customer-name"
            type="text"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            placeholder="Tu nombre (opcional)"
            className="w-full bg-ink/50 border border-olive/60 rounded-full px-5 py-3 text-sm text-cream placeholder:text-cream/40 focus:outline-none focus:border-gold transition"
          />
          <div className="flex justify-between items-center">
            <span className="text-cream/60 text-sm">Total</span>
            <span className="font-display font-bold text-2xl text-lime">
              {formatPrice(totalPrice())}
            </span>
          </div>
          <button
            type="button"
            onClick={handleOrder}
            className="w-full bg-wa text-ink font-bold py-4 rounded-full hover:brightness-110 transition shadow-lg shadow-wa/20 flex items-center justify-center gap-2.5"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 01 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            Hacer pedido por WhatsApp
          </button>

          <button
            type="button"
            onClick={clear}
            className="w-full rounded-full border border-olive/60 py-2.5 text-sm text-cream/60 transition hover:border-gold hover:text-lime"
          >
            Vaciar carrito
          </button>
        </div>
      </aside>
    </>
  )
}
