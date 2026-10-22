import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { resumenAcademico } from '@/features/perfil/formato'
import { obtenerPerfil } from '@/features/perfil/perfilApi'
import ProfileDetails from '@/features/perfil/ProfileDetails'
import ProfileHeader from '@/features/perfil/ProfileHeader'
import type { Perfil } from '@/features/perfil/tipos'
import { RUTAS } from '@/shared/lib/rutas'
import ErrorState from '@/shared/ui/ErrorState'

// Mi perfil: vista de lectura (HU-09 / FE-16).
export default function PerfilPage() {
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

  if (cargando) {
    return (
      <div className="space-y-6" role="status" aria-label="Cargando perfil">
        <Skeleton className="h-60 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState mensaje="No pudimos cargar tu perfil. Recarga la página para intentar de nuevo." />
    )
  }

  const datos = perfil
  if (!datos) return <Navigate to={RUTAS.perfilEditar} replace />

  // El servidor envía el nombre de la carrera aunque ya no esté en el catálogo.
  const detalle = resumenAcademico({
    carrera: datos.carreraNombre,
    semestre: datos.semestre,
    anioGrado: datos.anioGrado,
  })

  return (
    <article className="space-y-6">
      <ProfileHeader
        nombres={datos.nombres}
        apellidos={datos.apellidos}
        titular={datos.titular}
        detalle={detalle}
        ciudad={datos.ciudad}
      />

      <ProfileDetails
        descripcion={datos.descripcion}
        intereses={datos.intereses}
        habilidades={datos.habilidades}
      />
    </article>
  )
}