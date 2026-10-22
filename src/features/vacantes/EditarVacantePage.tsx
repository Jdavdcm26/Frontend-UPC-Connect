import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { obtenerCarreras } from '@/features/perfil/perfilApi'
import type { Carrera } from '@/features/perfil/tipos'
import type { Vacante } from '@/features/vacantes/tipos'
import VacancyForm from '@/features/vacantes/VacancyForm'
import { obtenerMiVacante } from '@/features/vacantes/vacantesApi'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'

const VolverAMisVacantes = () => (
  <Link to={RUTAS.empresaVacantes} className="text-sm underline">
    ← Volver a mis vacantes
  </Link>
)

// Editar una vacante de la empresa (FE-20).
// Con key={id}, si cambia la vacante de la URL el contenido se monta de nuevo con su estado limpio.
export default function EditarVacantePage() {
  const { id = '' } = useParams()
  return <EditarVacanteContenido key={id} id={id} />
}

function EditarVacanteContenido({ id }: { id: string }) {
  const [vacante, setVacante] = useState<Vacante>()
  const [carreras, setCarreras] = useState<Carrera[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<unknown>()

  // La vacante y las carreras se piden a la vez; el formulario necesita las dos.
  useEffect(() => {
    let vigente = true
    Promise.all([obtenerMiVacante(id), obtenerCarreras()])
      .then(([datosVacante, datosCarreras]) => {
        if (!vigente) return
        setVacante(datosVacante)
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
  }, [id])

  if (cargando) {
    return (
      <div className="mx-auto max-w-2xl space-y-4" role="status" aria-label="Cargando formulario">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (error || !vacante) {
    const noExiste = error instanceof ApiError && error.status === 404
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <p role="alert" className="text-destructive">
          {noExiste ? 'Esta vacante no existe.' : 'No pudimos cargar la vacante. Recarga la página para intentar de nuevo.'}
        </p>
        <VolverAMisVacantes />
      </div>
    )
  }

  if (vacante.estado === 'CERRADA') {
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
      <VacancyForm key={vacante.id} carreras={carreras} vacante={vacante} />
    </section>
  )
}
