import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { obtenerCarreras } from '@/features/perfil/perfilApi'
import type { Carrera } from '@/features/perfil/tipos'
import ApplyButton from '@/features/postulaciones/ApplyButton'
import {
  ETIQUETA_ESTADO,
  ETIQUETA_MODALIDAD,
  ETIQUETA_TIPO,
  type Vacante,
} from '@/features/vacantes/tipos'
import { obtenerVacante } from '@/features/vacantes/vacantesApi'
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
  const [vacante, setVacante] = useState<Vacante>()
  const [error, setError] = useState<unknown>()
  const [carreras, setCarreras] = useState<Carrera[]>([])
  // Cambiar este número vuelve a pedir la vacante (por ejemplo, después de postularse).
  const [recargas, setRecargas] = useState(0)

  // Al volver a pedirla se sigue mostrando la que ya había, sin parpadeos.
  useEffect(() => {
    let vigente = true
    obtenerVacante(id)
      .then((datos) => {
        if (!vigente) return
        setVacante(datos)
        setError(undefined)
      })
      .catch((e) => {
        if (vigente) setError(e)
      })
    return () => {
      vigente = false
    }
  }, [id, recargas])

  // Las carreras solo sirven para mostrar nombres: si fallan, esa sección no aparece.
  useEffect(() => {
    let vigente = true
    obtenerCarreras()
      .then((datos) => {
        if (vigente) setCarreras(datos)
      })
      .catch(() => {})
    return () => {
      vigente = false
    }
  }, [])

  // Si cambió el id de la URL, la vacante guardada es la anterior: se trata como «cargando».
  const datos = vacante?.id === id ? vacante : undefined

  if (!datos && error === undefined) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" role="status" aria-label="Cargando vacante">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!datos) {
    const noExiste = error instanceof ApiError && error.status === 404
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

  const nombresCarreras = carreras
    .filter((c) => datos.carreraIds.includes(c.id))
    .map((c) => c.nombre)

  return (
    <article className="mx-auto max-w-3xl space-y-4">
      <VolverAlListado />

      {!datos.abierta && (
        <p role="status" className="rounded-md border p-3 text-sm">
          {datos.estado === 'ACTIVA'
            ? 'La fecha de cierre de esta vacante ya pasó y no recibe postulaciones.'
            : `Esta vacante está ${ETIQUETA_ESTADO[datos.estado].toLowerCase()} y no recibe postulaciones.`}
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

      {/* Al terminar de postularse (bien o mal), se vuelve a pedir la vacante para saber si ya está postulado. */}
      <ApplyButton vacante={datos} onPostulado={() => setRecargas((n) => n + 1)} />

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