import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/features/auth/useSession'
import ProfileForm from '@/features/perfil/ProfileForm'
import { CLAVE_CARRERAS, CLAVE_PERFIL, obtenerCarreras, obtenerPerfil } from '@/features/perfil/perfilApi'

// Alta y edición del perfil (HU-09 / FE-15).
export default function PerfilEditarPage() {
  const { usuario } = useSession()
  const perfil = useQuery({ queryKey: CLAVE_PERFIL, queryFn: obtenerPerfil })
  const carreras = useQuery({ queryKey: CLAVE_CARRERAS, queryFn: obtenerCarreras })

  if (perfil.isPending || carreras.isPending) {
    return (
      <div className="mx-auto max-w-2xl space-y-4" role="status" aria-label="Cargando perfil">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
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

  const esPrimerAcceso = perfil.data === null

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">{esPrimerAcceso ? 'Crea tu perfil' : 'Editar perfil'}</h1>
      {esPrimerAcceso && (
        <p className="text-muted-foreground">
          Cuéntanos tu carrera y tu semestre para empezar. Son obligatorios.
        </p>
      )}
      <ProfileForm carreras={carreras.data} perfil={perfil.data} esEgresado={usuario?.esEgresado ?? false} />
    </section>
  )
}