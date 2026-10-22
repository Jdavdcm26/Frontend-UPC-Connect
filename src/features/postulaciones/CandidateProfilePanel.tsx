import { Compass, ExternalLink, GraduationCap, History, MapPin, MessageSquareText, UserRound, X } from 'lucide-react'
import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { cn } from 'cn'
import { Button, buttonVariants } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { resumenAcademico } from '@/features/perfil/formato'
import ProfileSection from '@/features/perfil/ProfileSection'
import ApplicationStateBadge from '@/features/postulaciones/ApplicationStateBadge'
import { obtenerPostulacionRecibida } from '@/features/postulaciones/postulacionesEmpresaApi'
import StateChangeSelect from '@/features/postulaciones/StateChangeSelect'
import StateHistory from '@/features/postulaciones/StateHistory'
import type { DetallePostulacionRecibida, EstadoPostulacion } from '@/features/postulaciones/tipos'
import { ApiError } from '@/shared/api/apiError'
import { inicialesDeNombre } from '@/shared/lib/iniciales'
import { RUTAS, rutaPerfilPublico } from '@/shared/lib/rutas'
import DatoIcono from '@/shared/ui/DatoIcono'
import ErrorState from '@/shared/ui/ErrorState'

type Props = {
  postulacionId: string
  // Avisa a la lista cuando cambia el estado, para que lo muestre sin volver a pedirla.
  onEstadoCambiado: (postulacionId: string, estado: EstadoPostulacion) => void
  onCerrar: () => void
}

// Panel lateral con el perfil visible del candidato, su mensaje y el historial (HU-47 / FE-25).
export default function CandidateProfilePanel({ postulacionId, onEstadoCambiado, onCerrar }: Props) {
  const [detalle, setDetalle] = useState<DetallePostulacionRecibida>()
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<unknown>()

  // La página monta este panel con key={postulacionId}: cada postulación empieza con el estado limpio.
  useEffect(() => {
    let vigente = true
    obtenerPostulacionRecibida(postulacionId)
      .then((datos) => {
        if (vigente) setDetalle(datos)
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
  }, [postulacionId])

  const cargado = !cargando && error === undefined && detalle !== undefined

  // Al abrir el panel, el foco pasa al título para que el teclado y los lectores de pantalla lo noten.
  const titulo = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (cargado) titulo.current?.focus()
  }, [cargado, postulacionId])

  // El servidor responde con el detalle actualizado: el panel y la lista lo muestran de inmediato.
  function alCambiar(nuevo: DetallePostulacionRecibida) {
    setDetalle(nuevo)
    onEstadoCambiado(nuevo.id, nuevo.estado)
  }

  if (error instanceof ApiError && (error.status === 403 || error.status === 404)) {
    return <Navigate to={RUTAS.sinPermiso} replace />
  }

  return (
    <aside
      aria-label="Perfil del candidato"
      className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6 lg:sticky lg:top-24"
    >
      {cargando && (
        <div className="space-y-3" role="status" aria-label="Cargando perfil del candidato">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {!cargando && error !== undefined && (
        <ErrorState mensaje="No pudimos cargar el perfil del candidato. Intenta de nuevo en un momento." />
      )}

      {cargado && detalle && <Contenido detalle={detalle} titulo={titulo} onCambiado={alCambiar} onCerrar={onCerrar} />}

      {!cargado && (
        <Button variant="outline" onClick={onCerrar}>
          <X aria-hidden="true" />
          Cerrar
        </Button>
      )}
    </aside>
  )
}

type ContenidoProps = {
  detalle: DetallePostulacionRecibida
  titulo: RefObject<HTMLHeadingElement | null>
  onCambiado: (detalle: DetallePostulacionRecibida) => void
  onCerrar: () => void
}

function Contenido({ detalle, titulo, onCambiado, onCerrar }: ContenidoProps) {
  const c = detalle.candidato
  const datosAcademicos = resumenAcademico(c)

  return (
    <>
      <header className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground"
        >
          {inicialesDeNombre(c.nombres, c.apellidos)}
        </span>
        <div className="min-w-0 flex-1 space-y-1.5">
          <ApplicationStateBadge estado={detalle.estado} />
          <h2 ref={titulo} tabIndex={-1} className="break-words text-xl font-bold focus:outline-none">
            {c.nombres} {c.apellidos}
          </h2>
          {c.titular && <p className="break-words">{c.titular}</p>}
          <div className="flex flex-col gap-1">
            <DatoIcono icono={GraduationCap}>{datosAcademicos}</DatoIcono>
            {c.ciudad && (
              <DatoIcono icono={MapPin}>
                <span className="sr-only">Ciudad: </span>
                {c.ciudad}
              </DatoIcono>
            )}
          </div>
        </div>
      </header>

      <StateChangeSelect
        key={detalle.estado}
        postulacionId={detalle.id}
        estadoActual={detalle.estado}
        onCambiado={onCambiado}
      />

      {detalle.mensaje && (
        <ProfileSection titulo="Mensaje de la postulación" icono={MessageSquareText} plana>
          <p className="whitespace-pre-line break-words rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
            {detalle.mensaje}
          </p>
        </ProfileSection>
      )}

      {c.descripcion && (
        <ProfileSection titulo="Acerca del candidato" icono={UserRound} plana>
          <p className="whitespace-pre-line break-words text-sm text-muted-foreground">{c.descripcion}</p>
        </ProfileSection>
      )}

      {c.intereses.length > 0 && (
        <ProfileSection titulo="Intereses" icono={Compass} plana>
          <ul className="flex flex-wrap gap-2">
            {c.intereses.map((interes) => (
              <li key={interes} className="rounded-full bg-tint-strong px-3 py-1 text-sm font-medium break-words">
                {interes}
              </li>
            ))}
          </ul>
        </ProfileSection>
      )}

      <ProfileSection titulo="Historial" icono={History} plana>
        <StateHistory historial={detalle.historial} />
      </ProfileSection>

      <div className="flex flex-wrap gap-2">
        {c.slug && (
          <Link to={rutaPerfilPublico(c.slug)} className={cn(buttonVariants({ variant: 'outline' }))}>
            <ExternalLink aria-hidden="true" />
            Ver perfil completo
          </Link>
        )}
        <Button variant="outline" onClick={onCerrar}>
          <X aria-hidden="true" />
          Cerrar
        </Button>
      </div>
    </>
  )
}