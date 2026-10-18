import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { rutaInicioPorRol } from '@/features/auth/rutaPorRol'
import { useSession } from '@/features/auth/useSession'

// Si ya hay una sesión activa, lleva a la página de inicio del rol (HU-03).
// Mientras la sesión carga, muestra el contenido normal para no dejar la pantalla en blanco.
export default function RedirigirSiHaySesion({ children }: { children: ReactNode }) {
  const { usuario } = useSession()
  if (usuario?.estado === 'ACTIVO') return <Navigate to={rutaInicioPorRol(usuario.rol)} replace />
  return children
}