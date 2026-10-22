import { useEffect, useState, type ReactNode } from 'react'
import { SesionContexto } from '@/features/auth/SesionContexto'
import { cerrarSesionApi, obtenerSesion } from '@/features/auth/sesionApi'
import type { Usuario } from '@/features/auth/tipos'
import { configurarSesionExpirada } from '@/shared/api/client'

// Consulta la sesión una vez y la comparte con toda la aplicación.
export default function SessionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let vigente = true
    obtenerSesion()
      .then((datos) => {
        if (vigente) setUsuario(datos)
      })
      .catch(() => {
        if (vigente) setUsuario(null)
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })
    return () => {
      vigente = false
    }
  }, [])

  // Si cualquier petición responde 401/419, la app pasa a "sin sesión" y RequireAuth lleva a iniciar sesión.
  useEffect(() => {
    configurarSesionExpirada(() => setUsuario(null))
    return () => configurarSesionExpirada(null)
  }, [])

  async function cerrarSesion() {
    await cerrarSesionApi()
    setUsuario(null)
  }

  async function refrescarSesion() {
    const datos = await obtenerSesion()
    setUsuario(datos)
    return datos
  }

  return (
    <SesionContexto.Provider value={{ usuario, cargando, cerrarSesion, refrescarSesion }}>
      {children}
    </SesionContexto.Provider>
  )
}
