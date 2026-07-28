// Helpers de formato para la UI.

/** Formatea un precio en pesos argentinos, ej. $ 8.000,00. */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(price)
}
