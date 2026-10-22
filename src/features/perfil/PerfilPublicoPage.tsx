import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NotFoundPage from '@/app/pages/NotFoundPage'
import { Skeleton } from '@/components/ui/skeleton'
import { obtenerPerfilPublico } from '@/features/perfil/perfilPublicoApi'
import PublicProfileView from '@/features/perfil/PublicProfileView'
import type { PerfilPublico } from '@/features/perfil/tipos'
import { ApiError } from '@/shared/api/apiError'
import ErrorState from '@/shared/ui/ErrorState'

// Perfil de otra persona: /perfiles/:slug (HU-27 / FE-26).
// Con key={slug}, al pasar de un perfil a otro el contenido se monta de nuevo con su estado limpio.
export default function PerfilPublicoPage() {
  const { slug = '' } = useParams()
  return <PerfilPublicoContenido key={slug} slug={slug} />
}

function PerfilPublicoContenido({ slug }: { slug: string }) {
  const [perfil, setPerfil] = useState<PerfilPublico>()
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    let vigente = true
    obtenerPerfilPublico(slug)
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
  }, [slug])

  if (cargando) {
    return (
      <div className="space-y-6" role="status" aria-label="Cargando perfil">
        <Skeleton className="h-60 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    )
  }

  // El servidor responde 404 tanto si el perfil no existe como si quien mira no puede verlo.
  if (error instanceof ApiError && error.status === 404) return <NotFoundPage />

  if (error || !perfil) {
    return (
      <ErrorState mensaje="No pudimos cargar este perfil. Recarga la página para intentar de nuevo." />
    )
  }

  return <PublicProfileView perfil={perfil} />
}
