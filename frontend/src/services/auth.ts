// Servicio de autenticación del admin: POST /api/auth/login devuelve un JWT
// que se guarda en localStorage y se envía como Bearer en las rutas protegidas.
// No hay logout en el backend (JWT stateless): "salir" es descartar el token.

import { apiRequest, setToken, clearToken } from './api'
import type { LoginResponse } from '../types'

/**
 * Valida usuario/contraseña contra el backend. Si son correctos guarda el JWT
 * en localStorage y devuelve la respuesta; si no, lanza ApiError (401).
 */
export async function login(username: string, password: string): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: { username, password },
  })
  setToken(response.token)
  return response
}

/** Cierra la sesión del admin descartando el JWT guardado. */
export function logout(): void {
  clearToken()
}
