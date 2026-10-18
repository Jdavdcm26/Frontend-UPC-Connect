import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { resumenAcademico } from '@/features/perfil/formato'
import { CLAVE_PERFIL, obtenerPerfil } from '@/features/perfil/perfilApi'
import ProfileDetails from '@/features/perfil/ProfileDetails'
import ProfileHeader from '@/features/perfil/ProfileHeader'
import { RUTAS } from '@/shared/lib/rutas'

// Mi perfil: vista de lectura (HU-09 / FE-16).
export default function PerfilPage() {
  const perfil = useQuery({ queryKey: CLAVE_PERFIL, queryFn: obtenerPerfil })

  if (perfil.isPending) {
    return (
      <div className="mx-auto max-w-2xl space-y-4" role="status" aria-label="Cargando perfil">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (perfil.isError) {
    return (
      <p role="alert" className="text-center text-destructive">
        No pudimos cargar tu perfil. Recarga la página para intentar de nuevo.
      </p>
    )
  }

  const datos = perfil.data
  if (!datos) return <Navigate to={RUTAS.perfilEditar} replace />

  // El servidor envía el nombre de la carrera aunque ya no esté en el catálogo.
  const detalle = resumenAcademico({
    carrera: datos.carreraNombre,
    semestre: datos.semestre,
    anioGrado: datos.anioGrado,
  })

  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <ProfileHeader nombre={`${datos.nombres} ${datos.apellidos}`} titular={datos.titular} detalle={detalle} />

      <ProfileDetails descripcion={datos.descripcion} ciudad={datos.ciudad} intereses={datos.intereses} />
    </article>
  )
}