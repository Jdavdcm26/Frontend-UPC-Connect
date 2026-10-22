import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NotFoundPage from '@/app/pages/NotFoundPage'
import { Skeleton } from '@/components/ui/skeleton'
import { obtenerPerfilPublico } from '@/features/perfil/perfilPublicoApi'
import PublicProfileView from '@/features/perfil/PublicProfileView'
import type { PerfilPublico } from '@/features/perfil/tipos'
import { ApiError } from '@/shared/api/apiError'

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
      <div className="mx-auto max-w-2xl space-y-4" role="status" aria-label="Cargando perfil">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  // El servidor responde 404 tanto si el perfil no existe como si quien mira no puede verlo.
  if (error instanceof ApiError && error.status === 404) return <NotFoundPage />

  if (error || !perfil) {
    return (
      <p role="alert" className="text-center text-destructive">
        No pudimos cargar este perfil. Recarga la página para intentar de nuevo.
      </p>
    )
  }

  return <PublicProfileView perfil={perfil} />
}
