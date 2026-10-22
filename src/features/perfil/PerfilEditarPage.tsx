import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/features/auth/useSession'
import ProfileForm from '@/features/perfil/ProfileForm'
import { obtenerCarreras, obtenerPerfil } from '@/features/perfil/perfilApi'
import SkillsEditor from '@/features/perfil/SkillsEditor'
import type { Carrera, Perfil } from '@/features/perfil/tipos'
import EncabezadoPagina from '@/shared/ui/EncabezadoPagina'
import ErrorState from '@/shared/ui/ErrorState'

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
      <div className="mx-auto max-w-3xl space-y-4" role="status" aria-label="Cargando perfil">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState mensaje="No pudimos cargar tu perfil. Recarga la página para intentar de nuevo." />
    )
  }

  const esPrimerAcceso = perfil === null
  const esEgresado = usuario?.esEgresado ?? false

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <EncabezadoPagina
        titulo={esPrimerAcceso ? 'Crea tu perfil' : 'Editar perfil'}
        descripcion={
          esPrimerAcceso
            ? `Cuéntanos tu carrera y ${esEgresado ? 'tu año de grado' : 'tu semestre'} para empezar. Son obligatorios.`
            : 'Las empresas pueden ver tu perfil cuando te postulas: mantenlo al día.'
        }
      />
      {/* Al guardar, el formulario devuelve el perfil nuevo y esta pantalla lo muestra de inmediato. */}
      <ProfileForm carreras={carreras} perfil={perfil} esEgresado={esEgresado} onGuardado={setPerfil} />
      {/* Las habilidades se agregan a un perfil que ya existe (HU-11 / FE-17). */}
      {perfil ? (
        <SkillsEditor habilidades={perfil.habilidades} onActualizar={setPerfil} />
      ) : (
        <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-muted-foreground">
          Guarda tu perfil para poder agregar habilidades.
        </p>
      )}
    </section>
  )
}
