import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import NotFoundPage from '@/app/pages/NotFoundPage'
import { Skeleton } from '@/components/ui/skeleton'
import { clavePerfilPublico, obtenerPerfilPublico } from '@/features/perfil/perfilPublicoApi'
import PublicProfileView from '@/features/perfil/PublicProfileView'
import { ApiError } from '@/shared/api/apiError'

// Perfil de otra persona: /perfiles/:slug (HU-27 / FE-26).
export default function PerfilPublicoPage() {
  const { slug = '' } = useParams()
  const perfil = useQuery({ queryKey: clavePerfilPublico(slug), queryFn: () => obtenerPerfilPublico(slug) })

  if (perfil.isPending) {
    return (
      <div className="mx-auto max-w-2xl space-y-4" role="status" aria-label="Cargando perfil">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  // El servidor responde 404 tanto si el perfil no existe como si quien mira no puede verlo.
  if (perfil.error instanceof ApiError && perfil.error.status === 404) return <NotFoundPage />

  if (perfil.isError) {
    return (
      <p role="alert" className="text-center text-destructive">
        No pudimos cargar este perfil. Recarga la página para intentar de nuevo.
      </p>
    )
  }

  return <PublicProfileView perfil={perfil.data} />
}
