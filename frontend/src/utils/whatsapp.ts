// Armado del mensaje y la URL de WhatsApp para enviar el pedido
// (CONTEXTO.md sección 8). El número viene de VITE_WHATSAPP_NUMBER.

import type { CartItem } from '../types'
import { formatPrice } from './format'

const WHATSAPP_NUMBER: string = import.meta.env.VITE_WHATSAPP_NUMBER ?? '5491151225690'

/**
 * Genera el texto del pedido con el formato acordado:
 * un ítem por línea con cantidad y subtotal, el total al final y,
 * si el cliente lo completó, su nombre.
 */
export function buildOrderMessage(items: CartItem[], customerName: string): string {
  const lines = items.map(
    (item) =>
      `- ${item.product.name} x${item.quantity} = ${formatPrice(item.product.price * item.quantity)}`,
  )
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const parts = [
    '¡Hola Yerbas BM! Quiero hacer un pedido:',
    '',
    ...lines,
    '',
    `Total: ${formatPrice(total)}`,
  ]
  if (customerName.trim()) {
    parts.push('', `Mi nombre: ${customerName.trim()}`)
  }
  return parts.join('\n')
}

/**
 * Devuelve la URL https://wa.me/{numero}?text={mensaje} con el mensaje
 * codificado, lista para abrir con window.open.
 */
export function buildWhatsAppUrl(items: CartItem[], customerName: string): string {
  const message = buildOrderMessage(items, customerName)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
