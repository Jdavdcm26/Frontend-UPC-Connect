import { UserX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/features/auth/useSession'
import { resumenAcademico } from '@/features/perfil/formato'
import { obtenerPerfilConRed } from '@/features/perfil/perfilApi'
import ProfileDetails from '@/features/perfil/ProfileDetails'
import ProfileHeader from '@/features/perfil/ProfileHeader'
import type { Perfil } from '@/features/perfil/tipos'
import SeccionPublicacionesAutor from '@/features/publicaciones/SeccionPublicacionesAutor'
import type { RedPropia } from '@/features/red/tipos'
import { RUTAS } from '@/shared/lib/rutas'
import ErrorState from '@/shared/ui/ErrorState'
import { claseEnlace } from '@/shared/ui/estilosEnlace'

// Mi perfil: vista de lectura (HU-09 / FE-16), con seguidores y seguidos (HU-28) y mis publicaciones.
export default function PerfilPage() {
  const { usuario } = useSession()
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [red, setRed] = useState<RedPropia>()
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    let vigente = true
    obtenerPerfilConRed()
      .then((datos) => {
        if (!vigente) return
        setPerfil(datos.perfil)
        setRed(datos.red)
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
        contadores={red}
      />

      <ProfileDetails
        descripcion={datos.descripcion}
        intereses={datos.intereses}
        habilidades={datos.habilidades}
      />

      <p>
        <Link to={RUTAS.bloqueados} className={`${claseEnlace} inline-flex items-center gap-1.5 text-sm`}>
          <UserX aria-hidden="true" className="size-4" />
          Cuentas bloqueadas
        </Link>
      </p>

      {usuario && (
        <SeccionPublicacionesAutor
          titulo="Mis publicaciones"
          autorId={usuario.id}
          puedeInteractuar
          textoVacio="Todavía no has publicado nada. Comparte algo desde «Publicaciones»."
        />
      )}
    </article>
  )
}