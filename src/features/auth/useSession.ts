import { useContext } from 'react'
import { SesionContexto } from '@/features/auth/SesionContexto'

// Devuelve { usuario, cargando, cerrarSesion }. Solo se usa dentro de SessionProvider.
export function useSession() {
  const estado = useContext(SesionContexto)
  if (!estado) throw new Error('useSession debe usarse dentro de SessionProvider')
  return estado
}