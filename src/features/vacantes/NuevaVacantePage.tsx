import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { CLAVE_CARRERAS, obtenerCarreras } from '@/features/perfil/perfilApi'
import VacancyForm from '@/features/vacantes/VacancyForm'

// Publicar una vacante (HU-41 / FE-19).
export default function NuevaVacantePage() {
  const carreras = useQuery({ queryKey: CLAVE_CARRERAS, queryFn: obtenerCarreras })

  if (carreras.isPending) {
    return (
      <div className="mx-auto max-w-2xl space-y-4" role="status" aria-label="Cargando formulario">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (carreras.isError) {
    return (
      <p role="alert" className="text-center text-destructive">
        No pudimos cargar las carreras. Recarga la página para intentar de nuevo.
      </p>
    )
  }

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Publicar vacante</h1>
      <VacancyForm carreras={carreras.data} />
    </section>
  )
}