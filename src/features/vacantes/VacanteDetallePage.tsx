import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CLAVE_CARRERAS, obtenerCarreras } from '@/features/perfil/perfilApi'
import {
  ETIQUETA_ESTADO,
  ETIQUETA_MODALIDAD,
  ETIQUETA_TIPO,
} from '@/features/vacantes/tipos'
import { claveVacante, obtenerVacante } from '@/features/vacantes/vacantesApi'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'

const VolverAlListado = () => (
  <Link to={RUTAS.vacantes} className="text-sm underline">
    ← Volver a vacantes
  </Link>
)

// Detalle de una vacante para el candidato (FE-22).
export default function VacanteDetallePage() {
  const { id = '' } = useParams()
  const vacante = useQuery({ queryKey: claveVacante(id), queryFn: () => obtenerVacante(id) })
  const carreras = useQuery({ queryKey: CLAVE_CARRERAS, queryFn: obtenerCarreras })

  if (vacante.isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" role="status" aria-label="Cargando vacante">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (vacante.isError) {
    const noExiste = vacante.error instanceof ApiError && vacante.error.status === 404
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <p role="alert" className="text-destructive">
          {noExiste
            ? 'Esta vacante no existe o ya no está disponible.'
            : 'No pudimos cargar la vacante. Intenta de nuevo en un momento.'}
        </p>
        <VolverAlListado />
      </div>
    )
  }

  const datos = vacante.data
  const nombresCarreras = (carreras.data ?? [])
    .filter((c) => datos.carreraIds.includes(c.id))
    .map((c) => c.nombre)

  return (
    <article className="mx-auto max-w-3xl space-y-4">
      <VolverAlListado />

      {datos.estado !== 'ACTIVA' && (
        <p role="status" className="rounded-md border p-3 text-sm">
          Esta vacante está {ETIQUETA_ESTADO[datos.estado].toLowerCase()} y no recibe postulaciones.
        </p>
      )}

      <header className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-2xl font-bold">{datos.titulo}</h1>
          <Badge variant="outline">{ETIQUETA_TIPO[datos.tipo]}</Badge>
        </div>
        <p>{datos.empresa}</p>
        <p className="text-sm text-muted-foreground">
          {ETIQUETA_MODALIDAD[datos.modalidad]} · {datos.ciudad} · Cierra el {datos.fechaCierre}
        </p>
      </header>

      <section className="space-y-1">
        <h2 className="font-semibold">Descripción</h2>
        <p className="whitespace-pre-line">{datos.descripcion}</p>
      </section>

      <section className="space-y-1">
        <h2 className="font-semibold">Requisitos</h2>
        <p className="whitespace-pre-line">{datos.requisitos}</p>
      </section>

      {nombresCarreras.length > 0 && (
        <section className="space-y-1">
          <h2 className="font-semibold">Carreras objetivo</h2>
          <ul className="list-inside list-disc">
            {nombresCarreras.map((nombre) => (
              <li key={nombre}>{nombre}</li>
            ))}
          </ul>
        </section>
      )}
    </article>
  )
}