import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { CLAVE_CARRERAS, obtenerCarreras } from '@/features/perfil/perfilApi'
import VacancyForm from '@/features/vacantes/VacancyForm'
import { claveMiVacante, obtenerMiVacante } from '@/features/vacantes/vacantesApi'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'

const VolverAMisVacantes = () => (
  <Link to={RUTAS.empresaVacantes} className="text-sm underline">
    ← Volver a mis vacantes
  </Link>
)

// Editar una vacante de la empresa (FE-20).
export default function EditarVacantePage() {
  const { id = '' } = useParams()
  const vacante = useQuery({ queryKey: claveMiVacante(id), queryFn: () => obtenerMiVacante(id) })
  const carreras = useQuery({ queryKey: CLAVE_CARRERAS, queryFn: obtenerCarreras })

  if (vacante.isPending || carreras.isPending) {
    return (
      <div className="mx-auto max-w-2xl space-y-4" role="status" aria-label="Cargando formulario">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (vacante.isError || carreras.isError) {
    const noExiste = vacante.error instanceof ApiError && vacante.error.status === 404
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <p role="alert" className="text-destructive">
          {noExiste ? 'Esta vacante no existe.' : 'No pudimos cargar la vacante. Recarga la página para intentar de nuevo.'}
        </p>
        <VolverAMisVacantes />
      </div>
    )
  }

  if (vacante.data.estado === 'CERRADA') {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <p role="status">Una vacante cerrada ya no se puede editar.</p>
        <VolverAMisVacantes />
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <VolverAMisVacantes />
      <h1 className="text-2xl font-bold">Editar vacante</h1>
      <VacancyForm key={vacante.data.id} carreras={carreras.data} vacante={vacante.data} />
    </section>
  )
}