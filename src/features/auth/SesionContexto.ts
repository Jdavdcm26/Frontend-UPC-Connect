import { createContext } from 'react'
import type { Usuario } from '@/features/auth/tipos'

// Lo que reciben los componentes al pedir la sesión.
export type EstadoSesion = {
  usuario: Usuario | null
  cargando: boolean
  cerrarSesion: () => Promise<void>
  // Vuelve a pedir la sesión al servidor y devuelve el usuario actualizado.
  refrescarSesion: () => Promise<Usuario | null>
}

export const SesionContexto = createContext<EstadoSesion | null>(null)