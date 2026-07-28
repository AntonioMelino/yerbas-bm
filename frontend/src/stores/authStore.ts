// Store de autenticación del admin (Zustand).
// Mantiene el estado de sesión reactivo para la UI (navbar, rutas protegidas);
// el token en sí vive en localStorage y lo lee api.ts en cada request.

import { create } from 'zustand'
import { getToken } from '../services/api'
import * as authService from '../services/auth'
import type { LoginResponse } from '../types'

interface AuthState {
  /** true si hay un JWT guardado (sesión de admin iniciada). */
  isAuthenticated: boolean
  /** Nombre de usuario del admin logueado (para mostrar en el panel). */
  username: string | null
  /** Llama a POST /api/auth/login; lanza ApiError si las credenciales fallan. */
  login: (username: string, password: string) => Promise<LoginResponse>
  /** Descarta el JWT y limpia el estado de sesión. */
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: getToken() !== null,
  username: null,

  async login(username, password) {
    const response = await authService.login(username, password)
    set({ isAuthenticated: true, username: response.username })
    return response
  },

  logout() {
    authService.logout()
    set({ isAuthenticated: false, username: null })
  },
}))
