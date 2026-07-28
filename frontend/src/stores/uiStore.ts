// Store de estado de UI (Zustand, sin persistencia): qué modal/drawer está
// abierto. Lo separo del cartStore porque es estado efímero de pantalla, no
// datos del negocio — el carrito en sí (items, cantidades) vive en cartStore.

import { create } from 'zustand'
import type { Product } from '../types'

interface UiState {
  /** Producto mostrado en el modal de detalle (null = modal cerrado). */
  selectedProduct: Product | null
  /** true si el drawer del carrito está abierto. */
  isCartOpen: boolean
  /** Abre el modal de detalle de un producto. */
  openProductModal: (product: Product) => void
  /** Cierra el modal de detalle. */
  closeProductModal: () => void
  /** Abre el drawer del carrito. */
  openCart: () => void
  /** Cierra el drawer del carrito. */
  closeCart: () => void
}

export const useUiStore = create<UiState>((set) => ({
  selectedProduct: null,
  isCartOpen: false,

  openProductModal: (product) => set({ selectedProduct: product }),
  closeProductModal: () => set({ selectedProduct: null }),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}))
