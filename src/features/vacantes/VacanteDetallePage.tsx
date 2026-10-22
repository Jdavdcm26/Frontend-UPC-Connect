import { ArrowLeft, Building2, CalendarClock, GraduationCap, Lock, MapPin, Monitor } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { obtenerCarreras } from '@/features/perfil/perfilApi'
import type { Carrera } from '@/features/perfil/tipos'
import ApplyButton from '@/features/postulaciones/ApplyButton'
import {
  ETIQUETA_ESTADO,
  ETIQUETA_MODALIDAD,
  type Vacante,
} from '@/features/vacantes/tipos'
import VacancyTypeBadge from '@/features/vacantes/VacancyTypeBadge'
import { obtenerVacante } from '@/features/vacantes/vacantesApi'
import { ApiError } from '@/shared/api/apiError'
import { formatearDia } from '@/shared/lib/fechas'
import { RUTAS } from '@/shared/lib/rutas'
import { claseEnlace } from '@/shared/ui/estilosEnlace'
import ErrorState from '@/shared/ui/ErrorState'

const VolverAlListado = () => (
  <Link to={RUTAS.vacantes} className={`${claseEnlace} inline-flex items-center gap-1.5 text-sm`}>
    <ArrowLeft aria-hidden="true" className="size-4" />
    Volver a vacantes
  </Link>
)

// Recuadro de una sección del detalle (descripción, requisitos, carreras objetivo).
function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="space-y-3 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-xl font-semibold">{titulo}</h2>
      {children}
    </section>
  )
}

// Fila de la tarjeta de datos clave: etiqueta con icono a la izquierda y el valor a la derecha.
function Dato({ icono: Icono, etiqueta, children }: { icono: typeof MapPin; etiqueta: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <dt className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
        <Icono aria-hidden="true" className="size-4" />
        {etiqueta}
      </dt>
      <dd className="min-w-0 break-words text-right text-sm font-medium">{children}</dd>
    </div>
  )
}

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
      <div className="space-y-4" role="status" aria-label="Cargando vacante">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-36 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  if (!datos) {
    const noExiste = error instanceof ApiError && error.status === 404
    return (
      <div className="space-y-4">
        <VolverAlListado />
        <ErrorState
          mensaje={
            noExiste
              ? 'Esta vacante no existe o ya no está disponible.'
              : 'No pudimos cargar la vacante. Intenta de nuevo en un momento.'
          }
        />
      </div>
    )
  }

  const nombresCarreras = carreras
    .filter((c) => datos.carreraIds.includes(c.id))
    .map((c) => c.nombre)

  return (
    <article className="space-y-4">
      <VolverAlListado />

      {!datos.abierta && (
        <p
          role="status"
          className="flex items-start gap-3 rounded-xl border border-ambar/30 bg-ambar-soft p-4 text-sm font-medium text-ambar"
        >
          <Lock aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {datos.estado === 'ACTIVA'
            ? 'La fecha de cierre de esta vacante ya pasó y no recibe postulaciones.'
            : `Esta vacante está ${ETIQUETA_ESTADO[datos.estado].toLowerCase()} y no recibe postulaciones.`}
        </p>
      )}

      {/* En pantallas angostas el orden es: encabezado, postulación y secciones; en anchas, las secciones
          quedan a la izquierda y la tarjeta de postulación a la derecha. */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:grid-rows-[auto_1fr]">
        <header className="space-y-3 rounded-xl border bg-card p-5 shadow-sm sm:p-6 lg:col-start-1 lg:row-start-1">
          <VacancyTypeBadge tipo={datos.tipo} />
          <h1 className="break-words text-2xl font-bold sm:text-3xl">{datos.titulo}</h1>
          <p className="flex items-center gap-2 text-lg text-muted-foreground">
            <Building2 aria-hidden="true" className="size-5 shrink-0" />
            {datos.empresa}
          </p>
        </header>

        <aside aria-label="Postulación" className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="space-y-4 rounded-xl border bg-card p-5 shadow-sm lg:sticky lg:top-24">
            {/* Al terminar de postularse (bien o mal), se vuelve a pedir la vacante para saber si ya está postulado. */}
            <ApplyButton vacante={datos} onPostulado={() => setRecargas((n) => n + 1)} />
            <dl className="divide-y border-t">
              <Dato icono={Monitor} etiqueta="Modalidad">
                {ETIQUETA_MODALIDAD[datos.modalidad]}
              </Dato>
              <Dato icono={MapPin} etiqueta="Ciudad">
                {datos.ciudad}
              </Dato>
              <Dato icono={CalendarClock} etiqueta="Cierra el">
                {formatearDia(datos.fechaCierre)}
              </Dato>
            </dl>
          </div>
        </aside>

        <div className="space-y-6 lg:col-start-1 lg:row-start-2">
          <Seccion titulo="Descripción">
            <p className="whitespace-pre-line break-words leading-relaxed">{datos.descripcion}</p>
          </Seccion>

          <Seccion titulo="Requisitos">
            <p className="whitespace-pre-line break-words leading-relaxed">{datos.requisitos}</p>
          </Seccion>

          {nombresCarreras.length > 0 && (
            <Seccion titulo="Carreras objetivo">
              <ul className="flex flex-wrap gap-2">
                {nombresCarreras.map((nombre) => (
                  <li
                    key={nombre}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-medium text-primary"
                  >
                    <GraduationCap aria-hidden="true" className="size-4" />
                    {nombre}
                  </li>
                ))}
              </ul>
            </Seccion>
          )}
        </div>
      </div>
    </article>
  )
}
