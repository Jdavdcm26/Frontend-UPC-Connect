import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { obtenerCarreras } from '@/features/perfil/perfilApi'
import type { Carrera } from '@/features/perfil/tipos'
import VacancyForm from '@/features/vacantes/VacancyForm'

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
      <div className="mx-auto max-w-2xl space-y-4" role="status" aria-label="Cargando formulario">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <p role="alert" className="text-center text-destructive">
        No pudimos cargar las carreras. Recarga la página para intentar de nuevo.
      </p>
    )
  }

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Publicar vacante</h1>
      <VacancyForm carreras={carreras} />
    </section>
  )
}
