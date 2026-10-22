import ApplicationStateBadge from '@/features/postulaciones/ApplicationStateBadge'
import type { CambioEstado } from '@/features/postulaciones/tipos'
import { formatearFechaHora } from '@/shared/lib/fechas'

// Historial de estados de una postulación: fecha, estado y responsable, del más reciente al más antiguo (HU-47).
// Se dibuja como una línea de tiempo: una raya a la izquierda con un punto por cada cambio.
export default function StateHistory({ historial }: { historial: CambioEstado[] }) {
  const recientesPrimero = [...historial].reverse()

  return (
    <ol className="ml-1.5 space-y-4 border-l-2 border-border">
      {recientesPrimero.map((cambio) => (
        <li key={`${cambio.fecha}-${cambio.estado}`} className="relative space-y-1 pl-5 text-sm">
          <span
            aria-hidden="true"
            className="absolute top-1.5 -left-[7px] size-3 rounded-full border-2 border-card bg-primary"
          />
          <ApplicationStateBadge estado={cambio.estado} />
          <p className="text-muted-foreground">{formatearFechaHora(cambio.fecha)}</p>
          <p className="break-words text-muted-foreground">Por {cambio.responsable}</p>
        </li>
      ))}
    </ol>
  )
}
