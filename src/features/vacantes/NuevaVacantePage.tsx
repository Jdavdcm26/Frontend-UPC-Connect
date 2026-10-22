import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { obtenerCarreras } from '@/features/perfil/perfilApi'
import type { Carrera } from '@/features/perfil/tipos'
import VacancyForm from '@/features/vacantes/VacancyForm'
import { RUTAS } from '@/shared/lib/rutas'
import EncabezadoPagina from '@/shared/ui/EncabezadoPagina'
import EnlaceVolver from '@/shared/ui/EnlaceVolver'
import ErrorState from '@/shared/ui/ErrorState'

// Publicar una vacante (HU-41 / FE-19).
export default function NuevaVacantePage() {
  const [carreras, setCarreras] = useState<Carrera[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    let vigente = true
    obtenerCarreras()
      .then((datos) => {
        if (vigente) setCarreras(datos)
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
      <div className="mx-auto max-w-3xl space-y-4" role="status" aria-label="Cargando formulario">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState mensaje="No pudimos cargar las carreras. Recarga la página para intentar de nuevo." />
    )
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-4">
        <EnlaceVolver to={RUTAS.empresaVacantes}>Volver a mis vacantes</EnlaceVolver>
        <EncabezadoPagina
          titulo="Publicar vacante"
          descripcion="Completa los datos de la oferta. Los candidatos de las carreras que elijas podrán postularse."
        />
      </div>
      <VacancyForm carreras={carreras} />
    </section>
  )
}
