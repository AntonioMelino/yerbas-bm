// Hooks de TanStack Query para categorías: query pública del catálogo y
// mutaciones del panel admin. El slug siempre lo genera el backend.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as categoryService from '../services/categories'

/** Lista todas las categorías. */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getCategories(),
  })
}

/** Invalida la query de categorías tras una mutación del admin. */
function useInvalidateCategories() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: ['categories'] })
}

/** Crea una categoría a partir del nombre. Lanza ApiError si falla. */
export function useCreateCategory() {
  const invalidate = useInvalidateCategories()
  return useMutation({
    mutationFn: (name: string) => categoryService.createCategory(name),
    onSuccess: invalidate,
  })
}

/** Renombra una categoría (el backend regenera el slug). Lanza ApiError si falla. */
export function useUpdateCategory() {
  const invalidate = useInvalidateCategories()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      categoryService.updateCategory(id, name),
    onSuccess: invalidate,
  })
}

/** Elimina una categoría por id. Lanza ApiError si falla. */
export function useDeleteCategory() {
  const invalidate = useInvalidateCategories()
  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: invalidate,
  })
}
