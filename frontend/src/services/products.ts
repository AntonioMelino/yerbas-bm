// Servicio de productos: encapsula los endpoints /api/products (CONTEXTO.md sección 6).
// Los GET son públicos; las mutaciones requieren JWT (auth: true).

import { apiRequest } from './api'
import type { Product } from '../types'

/** Lista los productos activos. Si se pasa categorySlug filtra por categoría (?category={slug}). */
export function getProducts(categorySlug?: string): Promise<Product[]> {
  const query = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : ''
  return apiRequest<Product[]>(`/products${query}`)
}

/** Devuelve el detalle de un producto por id. */
export function getProduct(id: string): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`)
}

/**
 * Crea un producto (admin). Recibe multipart/form-data ya armado
 * (ver buildProductFormData en ProductFormPage) — la imagen es obligatoria.
 */
export function createProduct(formData: FormData): Promise<Product> {
  return apiRequest<Product>('/products', { method: 'POST', body: formData, auth: true })
}

/**
 * Actualiza un producto (admin). También multipart/form-data; si el FormData
 * no incluye el campo Image, el backend conserva la imagen existente.
 */
export function updateProduct(id: string, formData: FormData): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`, { method: 'PUT', body: formData, auth: true })
}

/** Elimina un producto (admin). Devuelve 204 sin body. */
export function deleteProduct(id: string): Promise<void> {
  return apiRequest<void>(`/products/${id}`, { method: 'DELETE', auth: true })
}
