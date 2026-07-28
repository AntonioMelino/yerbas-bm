// Notificación flotante (toast) abajo a la derecha: confirma acciones como
// "producto agregado al carrito" o la suscripción del newsletter.
// El mensaje y la visibilidad los maneja uiStore.showToast (3 segundos).

import { useUiStore } from '../stores/uiStore'

export default function Toast() {
  const toast = useUiStore((state) => state.toast)

  return (
    <div
      className={`fixed bottom-8 right-8 z-[60] flex items-center gap-3 rounded-xl bg-tinta px-5 py-4 text-white shadow-card-hover transition-all duration-300 ${
        toast ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0'
      }`}
      role="status"
      aria-live="polite"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-mate">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className="h-4 w-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </span>
      <span className="text-sm">{toast}</span>
    </div>
  )
}
