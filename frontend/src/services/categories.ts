// Servicio de categorías: encapsula los endpoints /api/categories (CONTEXTO.md sección 6).
// El slug lo genera siempre el backend — el frontend solo envía { name }.

import { apiRequest } from './api'
import type { Category } from '../types'

/** Lista todas las categorías (público). */
export function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>('/categories')
}

/** Crea una categoría (admin). El slug se autogenera en el backend a partir del nombre. */
export function createCategory(name: string): Promise<Category> {
  return apiRequest<Category>('/categories', { method: 'POST', body: { name }, auth: true })
}

/** Actualiza el nombre de una categoría (admin). El backend regenera el slug. */
export function updateCategory(id: string, name: string): Promise<Category> {
  return apiRequest<Category>(`/categories/${id}`, { method: 'PUT', body: { name }, auth: true })
}

/** Elimina una categoría (admin). Devuelve 204 sin body. */
export function deleteCategory(id: string): Promise<void> {
  return apiRequest<void>(`/categories/${id}`, { method: 'DELETE', auth: true })
}
