import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef, type RefObject } from 'react'
import { Navigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { resumenAcademico } from '@/features/perfil/formato'
import ProfileSection from '@/features/perfil/ProfileSection'
import ApplicationStateBadge from '@/features/postulaciones/ApplicationStateBadge'
import { claveDetalleRecibida, obtenerPostulacionRecibida } from '@/features/postulaciones/postulacionesEmpresaApi'
import StateChangeSelect from '@/features/postulaciones/StateChangeSelect'
import StateHistory from '@/features/postulaciones/StateHistory'
import type { DetallePostulacionRecibida } from '@/features/postulaciones/tipos'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'

type Props = {
  postulacionId: string
  // Vacante a la que pertenece la postulación (para actualizar su lista al cambiar el estado).
  vacanteId: string
  onCerrar: () => void
}

// Panel lateral con el perfil visible del candidato, su mensaje y el historial (HU-47 / FE-25).
export default function CandidateProfilePanel({ postulacionId, vacanteId, onCerrar }: Props) {
  const detalle = useQuery({
    queryKey: claveDetalleRecibida(postulacionId),
    queryFn: () => obtenerPostulacionRecibida(postulacionId),
  })

  // Al abrir el panel, el foco pasa al título para que el teclado y los lectores de pantalla lo noten.
  const titulo = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (detalle.isSuccess) titulo.current?.focus()
  }, [detalle.isSuccess, postulacionId])

  if (detalle.error instanceof ApiError && (detalle.error.status === 403 || detalle.error.status === 404)) {
    return <Navigate to={RUTAS.sinPermiso} replace />
  }

  return (
    <aside aria-label="Perfil del candidato" className="space-y-4 rounded-lg border p-4">
      {detalle.isPending && (
        <div className="space-y-3" role="status" aria-label="Cargando perfil del candidato">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {detalle.isError && (
        <p role="alert" className="text-sm text-destructive">
          No pudimos cargar el perfil del candidato. Intenta de nuevo en un momento.
        </p>
      )}

      {detalle.isSuccess && (
        <Contenido detalle={detalle.data} vacanteId={vacanteId} titulo={titulo} onCerrar={onCerrar} />
      )}

      {!detalle.isSuccess && (
        <Button variant="outline" size="sm" onClick={onCerrar}>
          Cerrar
        </Button>
      )}
    </aside>
  )
}

type ContenidoProps = {
  detalle: DetallePostulacionRecibida
  vacanteId: string
  titulo: RefObject<HTMLHeadingElement | null>
  onCerrar: () => void
}

function Contenido({ detalle, vacanteId, titulo, onCerrar }: ContenidoProps) {
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
        vacanteId={vacanteId}
        estadoActual={detalle.estado}
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

      <Button variant="outline" size="sm" onClick={onCerrar}>
        Cerrar
      </Button>
    </>
  )
}