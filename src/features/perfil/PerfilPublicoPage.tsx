import { Ban } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import NotFoundPage from '@/app/pages/NotFoundPage'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/features/auth/useSession'
import { obtenerPerfilPublico, type PerfilPublicoConRed } from '@/features/perfil/perfilPublicoApi'
import PublicProfileView from '@/features/perfil/PublicProfileView'
import SeccionPublicacionesAutor from '@/features/publicaciones/SeccionPublicacionesAutor'
import BlockButton from '@/features/red/BlockButton'
import FollowButton from '@/features/red/FollowButton'
import { ApiError } from '@/shared/api/apiError'
import AvisoInformativo from '@/shared/ui/AvisoInformativo'
import ErrorState from '@/shared/ui/ErrorState'

// Perfil de otra persona: /perfiles/:slug (HU-27 / FE-26), con seguir (HU-28), bloquear (HU-31)
// y sus publicaciones. Con key={slug}, al pasar de un perfil a otro el contenido se monta de nuevo con su estado limpio.
export default function PerfilPublicoPage() {
  const { slug = '' } = useParams()
  return <PerfilPublicoContenido key={slug} slug={slug} />
}

function PerfilPublicoContenido({ slug }: { slug: string }) {
  const { usuario } = useSession()
  const [datos, setDatos] = useState<PerfilPublicoConRed>()
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<unknown>()
  // Cambiar este número vuelve a pedir el perfil (después de bloquear o desbloquear).
  const [recargas, setRecargas] = useState(0)

  // Al volver a pedirlo se sigue mostrando el que ya había, sin parpadeos.
  useEffect(() => {
    let vigente = true
    obtenerPerfilPublico(slug)
      .then((respuesta) => {
        if (!vigente) return
        setDatos(respuesta)
        setError(undefined)
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
  }, [slug, recargas])

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

  if (!datos) {
    return <ErrorState mensaje="No pudimos cargar este perfil. Recarga la página para intentar de nuevo." />
  }

  const { perfil, red } = datos
  const esPropio = red.usuarioId === usuario?.id
  const esCandidato = usuario?.rol === 'candidato'
  const nombre = `${perfil.nombres} ${perfil.apellidos}`

  // En el propio perfil no se sigue ni se bloquea; solo estudiantes y egresados siguen, y no a quien bloquearon.
  const acciones = esPropio ? undefined : (
    <>
      {esCandidato && !red.loBloqueaste && (
        <FollowButton
          usuarioId={red.usuarioId}
          nombre={nombre}
          siguiendo={red.loSigues}
          onCambio={({ siguiendo, seguidores }) =>
            setDatos((actual) => (actual ? { ...actual, red: { ...actual.red, loSigues: siguiendo, seguidores } } : actual))
          }
        />
      )}
      <BlockButton
        usuarioId={red.usuarioId}
        nombre={nombre}
        bloqueada={red.loBloqueaste}
        onCambio={() => setRecargas((n) => n + 1)}
      />
    </>
  )

  return (
    <div className="space-y-6">
      {red.loBloqueaste && (
        <AvisoInformativo icono={Ban}>
          Bloqueaste a {nombre}. No ves sus publicaciones ni sus comentarios, y esa persona tampoco ve los tuyos.
        </AvisoInformativo>
      )}

      <PublicProfileView
        perfil={perfil}
        contadores={{ seguidores: red.seguidores, seguidos: red.seguidos }}
        acciones={acciones}
      />

      {!red.loBloqueaste && (
        <SeccionPublicacionesAutor
          titulo={esPropio ? 'Mis publicaciones' : `Publicaciones de ${perfil.nombres}`}
          autorId={red.usuarioId}
          puedeInteractuar={esCandidato}
          textoVacio={esPropio ? 'Todavía no has publicado nada.' : `${perfil.nombres} todavía no ha publicado nada.`}
        />
      )}
    </div>
  )
}
