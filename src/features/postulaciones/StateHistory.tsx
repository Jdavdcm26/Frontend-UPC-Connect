import ApplicationStateBadge from '@/features/postulaciones/ApplicationStateBadge'
import type { CambioEstado } from '@/features/postulaciones/tipos'
import { formatearFechaHora } from '@/shared/lib/fechas'

// Historial de estados de una postulación: fecha, estado y responsable, del más reciente al más antiguo (HU-47).
export default function StateHistory({ historial }: { historial: CambioEstado[] }) {
  const recientesPrimero = [...historial].reverse()

  return (
    <ol className="space-y-2">
      {recientesPrimero.map((cambio) => (
        <li key={`${cambio.fecha}-${cambio.estado}`} className="space-y-1 rounded-md border p-2 text-sm">
          <ApplicationStateBadge estado={cambio.estado} />
          <p className="text-muted-foreground">{formatearFechaHora(cambio.fecha)}</p>
          <p className="break-words text-muted-foreground">Por {cambio.responsable}</p>
        </li>
      ))}
    </ol>
  )
}