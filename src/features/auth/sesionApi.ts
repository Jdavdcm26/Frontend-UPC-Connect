import { ApiError } from '@/shared/api/apiError'
import { api } from '@/shared/api/client'
import type { Usuario } from '@/features/auth/tipos'
import { usuarioDesdeServidor, type UsuarioServidor } from '@/features/auth/usuarioServidor'

// Mientras el backend no esté listo, VITE_USAR_FIXTURES=true simula la sesión.
// Solo es para desarrollo: con la API real la sesión es una cookie (no se guarda token).
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
  if (USAR_FIXTURES) {
    sessionStorage.removeItem(CLAVE_DEMO)
    return
  }
  await api.post('/api/v1/auth/logout')
}

// Solo para el modo demo: deja a un usuario de ejemplo con sesión iniciada.
export function iniciarSesionDemo(usuario: Usuario): void {
  sessionStorage.setItem(CLAVE_DEMO, JSON.stringify(usuario))
}