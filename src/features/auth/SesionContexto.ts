import { createContext } from 'react'
import type { Usuario } from '@/features/auth/tipos'

// Lo que reciben los componentes al pedir la sesión.
export type EstadoSesion = {
  usuario: Usuario | null
  cargando: boolean
  cerrarSesion: () => Promise<void>
}

export const SesionContexto = createContext<EstadoSesion | null>(null)