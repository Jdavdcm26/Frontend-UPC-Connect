import { EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/features/auth/useSession'
import CommentSection from '@/features/publicaciones/CommentSection'
import PostActions from '@/features/publicaciones/PostActions'
import PostCard from '@/features/publicaciones/PostCard'
import { obtenerPublicacion } from '@/features/publicaciones/publicacionesApi'
import type { Publicacion } from '@/features/publicaciones/tipos'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'
import AvisoInformativo from '@/shared/ui/AvisoInformativo'
import EnlaceVolver from '@/shared/ui/EnlaceVolver'
import ErrorState from '@/shared/ui/ErrorState'

const VolverAlFeed = () => <EnlaceVolver to={RUTAS.publicaciones}>Volver a publicaciones</EnlaceVolver>

// Detalle de una publicación con sus comentarios (HU-18, HU-26).
// Con key={id}, al pasar de una publicación a otra el estado empieza limpio.
export default function PublicacionDetallePage() {
  const { id = '' } = useParams()
  return <PublicacionDetalleContenido key={id} id={id} />
}

function PublicacionDetalleContenido({ id }: { id: string }) {
  const { usuario } = useSession()
  const esCandidato = usuario?.rol === 'candidato'
  const [publicacion, setPublicacion] = useState<Publicacion>()
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    let vigente = true
    obtenerPublicacion(id)
      .then((datos) => {
        if (vigente) setPublicacion(datos)
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
  }, [id])

  if (cargando) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" role="status" aria-label="Cargando publicación">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    )
  }

  if (error || !publicacion) {
    const noExiste = error instanceof ApiError && error.status === 404
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <VolverAlFeed />
        <ErrorState
          mensaje={
            noExiste
              ? 'Esta publicación no existe o ya no está disponible.'
              : 'No pudimos cargar la publicación. Recarga la página para intentar de nuevo.'
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <VolverAlFeed />
      <h1 className="sr-only">Publicación de {publicacion.autor.nombreCompleto}</h1>

      {publicacion.oculta && (
        <AvisoInformativo icono={EyeOff}>
          La administración ocultó esta publicación. Solo tú la ves y ya no se puede editar; aún puedes eliminarla.
        </AvisoInformativo>
      )}

      {publicacion.esMia && <PostActions publicacion={publicacion} onCambio={setPublicacion} />}

      <PostCard publicacion={publicacion} puedeInteractuar={esCandidato} completa />

      <CommentSection
        publicacionId={publicacion.id}
        puedeComentar={esCandidato && !publicacion.oculta}
        onTotalCambia={(cambio) =>
          setPublicacion((actual) => (actual ? { ...actual, comentarios: Math.max(0, actual.comentarios + cambio) } : actual))
        }
      />
    </div>
  )
}
