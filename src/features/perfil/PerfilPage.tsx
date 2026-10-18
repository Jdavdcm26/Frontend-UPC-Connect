import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { CLAVE_CARRERAS, CLAVE_PERFIL, obtenerCarreras, obtenerPerfil } from '@/features/perfil/perfilApi'
import ProfileHeader from '@/features/perfil/ProfileHeader'
import ProfileSection from '@/features/perfil/ProfileSection'
import { RUTAS } from '@/shared/lib/rutas'

// Mi perfil: vista de lectura (HU-09 / FE-16).
export default function PerfilPage() {
  const perfil = useQuery({ queryKey: CLAVE_PERFIL, queryFn: obtenerPerfil })
  const carreras = useQuery({ queryKey: CLAVE_CARRERAS, queryFn: obtenerCarreras })

  if (perfil.isPending || carreras.isPending) {
    return (
      <div className="mx-auto max-w-2xl space-y-4" role="status" aria-label="Cargando perfil">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (perfil.isError || carreras.isError) {
    return (
      <p role="alert" className="text-center text-destructive">
        No pudimos cargar tu perfil. Recarga la página para intentar de nuevo.
      </p>
    )
  }

  const datos = perfil.data
  if (!datos) return <Navigate to={RUTAS.perfilEditar} replace />

  // Una carrera desactivada sigue en el catálogo, así que se muestra igual.
  const carrera = carreras.data.find((c) => c.id === datos.carreraId)?.nombre ?? 'Carrera no disponible'
  const detalle = [carrera, `Semestre ${datos.semestre}`, datos.anioGrado ? `Egresado en ${datos.anioGrado}` : null]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <ProfileHeader nombre={`${datos.nombres} ${datos.apellidos}`} titular={datos.titular} detalle={detalle} />

      {datos.descripcion && (
        <ProfileSection titulo="Acerca de mí">
          <p className="whitespace-pre-line text-muted-foreground">{datos.descripcion}</p>
        </ProfileSection>
      )}

      {datos.ciudad && (
        <ProfileSection titulo="Ciudad">
          <p className="text-muted-foreground">{datos.ciudad}</p>
        </ProfileSection>
      )}

      {datos.intereses.length > 0 && (
        <ProfileSection titulo="Intereses">
          <ul className="flex flex-wrap gap-2">
            {datos.intereses.map((interes) => (
              <li key={interes} className="rounded-full border px-3 py-1 text-sm">
                {interes}
              </li>
            ))}
          </ul>
        </ProfileSection>
      )}
    </article>
  )
}