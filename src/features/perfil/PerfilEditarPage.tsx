import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/features/auth/useSession'
import ProfileForm from '@/features/perfil/ProfileForm'
import { obtenerCarreras, obtenerPerfil } from '@/features/perfil/perfilApi'
import SkillsEditor from '@/features/perfil/SkillsEditor'
import type { Carrera, Perfil } from '@/features/perfil/tipos'

// Alta y edición del perfil (HU-09 / FE-15).
export default function PerfilEditarPage() {
  const { usuario } = useSession()
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [carreras, setCarreras] = useState<Carrera[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<unknown>()

  // Perfil y carreras se piden a la vez; la pantalla espera a tener los dos.
  useEffect(() => {
    let vigente = true
    Promise.all([obtenerPerfil(), obtenerCarreras()])
      .then(([datosPerfil, datosCarreras]) => {
        if (!vigente) return
        setPerfil(datosPerfil)
        setCarreras(datosCarreras)
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
      <div className="mx-auto max-w-2xl space-y-4" role="status" aria-label="Cargando perfil">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <p role="alert" className="text-center text-destructive">
        No pudimos cargar tu perfil. Recarga la página para intentar de nuevo.
      </p>
    )
  }

  const esPrimerAcceso = perfil === null
  const esEgresado = usuario?.esEgresado ?? false

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">{esPrimerAcceso ? 'Crea tu perfil' : 'Editar perfil'}</h1>
      {esPrimerAcceso && (
        <p className="text-muted-foreground">
          Cuéntanos tu carrera y {esEgresado ? 'tu año de grado' : 'tu semestre'} para empezar. Son obligatorios.
        </p>
      )}
      {/* Al guardar, el formulario devuelve el perfil nuevo y esta pantalla lo muestra de inmediato. */}
      <ProfileForm carreras={carreras} perfil={perfil} esEgresado={esEgresado} onGuardado={setPerfil} />
      {/* Las habilidades se agregan a un perfil que ya existe (HU-11 / FE-17). */}
      {perfil ? (
        <SkillsEditor habilidades={perfil.habilidades} onActualizar={setPerfil} />
      ) : (
        <p className="text-sm text-muted-foreground">Guarda tu perfil para poder agregar habilidades.</p>
      )}
    </section>
  )
}
