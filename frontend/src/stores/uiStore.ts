// Store de estado de UI (Zustand, sin persistencia): qué modal/drawer está
// abierto y el toast visible. Lo separo del cartStore porque es estado efímero
// de pantalla, no datos del negocio — el carrito en sí (items, cantidades)
// vive en cartStore.

import { create } from 'zustand'
import type { Product } from '../types'

interface UiState {
  /** Producto mostrado en el modal de detalle (null = modal cerrado). */
  selectedProduct: Product | null
  /** true si el drawer del carrito está abierto. */
  isCartOpen: boolean
  /** Mensaje del toast visible (null = sin toast). */
  toast: string | null
  /** Abre el modal de detalle de un producto. */
  openProductModal: (product: Product) => void
  /** Cierra el modal de detalle. */
  closeProductModal: () => void
  /** Abre el drawer del carrito. */
  openCart: () => void
  /** Cierra el drawer del carrito. */
  closeCart: () => void
  /** Muestra un toast por 3 segundos (ej. "Producto agregado al carrito"). */
  showToast: (message: string) => void
}

/** Handle del timeout del toast, para reiniciarlo si llega otro mensaje antes. */
let toastTimer: ReturnType<typeof setTimeout> | undefined

export const useUiStore = create<UiState>((set) => ({
  selectedProduct: null,
  isCartOpen: false,
  toast: null,

  openProductModal: (product) => set({ selectedProduct: product }),
  closeProductModal: () => set({ selectedProduct: null }),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  showToast: (message) => {
    if (toastTimer) clearTimeout(toastTimer)
    set({ toast: message })
    toastTimer = setTimeout(() => set({ toast: null }), 3000)
  },
}))
