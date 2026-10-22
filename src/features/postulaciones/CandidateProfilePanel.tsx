import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link, Navigate } from 'react-router-dom'
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
import { RUTAS, rutaPerfilPublico } from '@/shared/lib/rutas'

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
    <aside aria-label="Perfil del candidato" className="space-y-4 rounded-lg border p-4">
      {cargando && (
        <div className="space-y-3" role="status" aria-label="Cargando perfil del candidato">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {!cargando && error !== undefined && (
        <p role="alert" className="text-sm text-destructive">
          No pudimos cargar el perfil del candidato. Intenta de nuevo en un momento.
        </p>
      )}

      {cargado && detalle && <Contenido detalle={detalle} titulo={titulo} onCambiado={alCambiar} onCerrar={onCerrar} />}

      {!cargado && (
        <Button variant="outline" size="sm" onClick={onCerrar}>
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
      <header className="space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h2 ref={titulo} tabIndex={-1} className="text-xl font-bold focus:outline-none">
            {c.nombres} {c.apellidos}
          </h2>
          <ApplicationStateBadge estado={detalle.estado} />
        </div>
        {c.titular && <p>{c.titular}</p>}
        <p className="text-sm text-muted-foreground">{datosAcademicos}</p>
        {c.ciudad && <p className="text-sm text-muted-foreground">{c.ciudad}</p>}
      </header>

      <StateChangeSelect
        key={detalle.estado}
        postulacionId={detalle.id}
        estadoActual={detalle.estado}
        onCambiado={onCambiado}
      />

      {detalle.mensaje && (
        <ProfileSection titulo="Mensaje de la postulación">
          <p className="whitespace-pre-line break-words text-sm text-muted-foreground">{detalle.mensaje}</p>
        </ProfileSection>
      )}

      {c.descripcion && (
        <ProfileSection titulo="Acerca del candidato">
          <p className="whitespace-pre-line break-words text-sm text-muted-foreground">{c.descripcion}</p>
        </ProfileSection>
      )}

      {c.intereses.length > 0 && (
        <ProfileSection titulo="Intereses">
          <ul className="flex flex-wrap gap-2">
            {c.intereses.map((interes) => (
              <li key={interes} className="rounded-full border px-3 py-1 text-sm">
                {interes}
              </li>
            ))}
          </ul>
        </ProfileSection>
      )}

      <ProfileSection titulo="Historial">
        <StateHistory historial={detalle.historial} />
      </ProfileSection>

      <div className="flex flex-wrap gap-2">
        {c.slug && (
          <Link to={rutaPerfilPublico(c.slug)} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            Ver perfil completo
          </Link>
        )}
        <Button variant="outline" size="sm" onClick={onCerrar}>
          Cerrar
        </Button>
      </div>
    </>
  )
}