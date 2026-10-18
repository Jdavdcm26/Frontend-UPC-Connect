import type { ReactNode } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { SesionContexto } from '@/features/auth/SesionContexto'
import { CLAVE_SESION, cerrarSesionApi, obtenerSesion } from '@/features/auth/sesionApi'

// Consulta la sesión una vez y la comparte con toda la aplicación.
export default function SessionProvider({ children }: { children: ReactNode }) {
  const clienteQuery = useQueryClient()
  const { data, isPending } = useQuery({
    queryKey: CLAVE_SESION,
    queryFn: obtenerSesion,
    staleTime: 5 * 60 * 1000, // la sesión se considera vigente 5 minutos
  })

  async function cerrarSesion() {
    await cerrarSesionApi()
    clienteQuery.setQueryData(CLAVE_SESION, null) // la app pasa a "sin sesión" al instante
  }

  return (
    <SesionContexto.Provider value={{ usuario: data ?? null, cargando: isPending, cerrarSesion }}>
      {children}
    </SesionContexto.Provider>
  )
}