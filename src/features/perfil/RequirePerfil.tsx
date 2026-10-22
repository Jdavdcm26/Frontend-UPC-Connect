import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { obtenerPerfil } from '@/features/perfil/perfilApi'
import type { Perfil } from '@/features/perfil/tipos'
import { RUTAS } from '@/shared/lib/rutas'

// Protege las pantallas que exigen perfil: sin perfil lleva a crearlo (HU-09, primer acceso).
export default function RequirePerfil() {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    let vigente = true
    obtenerPerfil()
      .then((datos) => {
        if (vigente) setPerfil(datos)
      })
      .catch((e) => {
        if (vigente) setError(e)
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })
    return () => {
      vigente = false
    }
  }, [])

  if (cargando) return <Skeleton className="h-10 w-full" />

  if (error) {
    return (
      <p role="alert" className="text-center text-destructive">
        No pudimos cargar tu perfil. Recarga la página para intentar de nuevo.
      </p>
    )
  }

  if (perfil === null) return <Navigate to={RUTAS.perfilEditar} replace />

  return <Outlet />
}
