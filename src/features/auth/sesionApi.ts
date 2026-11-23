import { ApiError } from '@/shared/api/apiError'
import { api, borrarToken } from '@/shared/api/client'
import type { Usuario } from '@/features/auth/tipos'
import { usuarioDesdeServidor, type UsuarioServidor } from '@/features/auth/usuarioServidor'

// Mientras el backend no esté listo, VITE_USAR_FIXTURES=true simula la sesión.
// Con la API real, la sesión es el token de Sanctum guardado en localStorage.
export const USAR_FIXTURES = import.meta.env.VITE_USAR_FIXTURES === 'true'
const CLAVE_DEMO = 'upc-sesion-demo'

// Devuelve el usuario con sesión, o null si no la hay (401).
export async function obtenerSesion(): Promise<Usuario | null> {
  if (USAR_FIXTURES) {
    const guardado = sessionStorage.getItem(CLAVE_DEMO)
    return guardado ? (JSON.parse(guardado) as Usuario) : null
  }
  try {
    const respuesta = await api.get<{ data: UsuarioServidor }>('/api/v1/me')
    return usuarioDesdeServidor(respuesta.data)
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}

export async function cerrarSesionApi(): Promise<void> {
  borrarToken()
  if (USAR_FIXTURES) {
    sessionStorage.removeItem(CLAVE_DEMO)
  }
}

// Solo para el modo demo: deja a un usuario de ejemplo con sesión iniciada.
export function iniciarSesionDemo(usuario: Usuario): void {
  sessionStorage.setItem(CLAVE_DEMO, JSON.stringify(usuario))
}