import { CalendarClock, CircleCheck, CircleX, Inbox, Search, type LucideIcon } from 'lucide-react'
import { cn } from 'cn'
import { ETIQUETA_ESTADO_POSTULACION, type EstadoPostulacion } from '@/features/postulaciones/tipos'

// Color e ícono de cada estado. El ícono es solo un apoyo: el texto siempre dice el estado.
const ESTILO: Record<EstadoPostulacion, { clases: string; icono: LucideIcon }> = {
  RECIBIDA: { clases: 'bg-estado-recibida-soft text-estado-recibida', icono: Inbox },
  EN_REVISION: { clases: 'bg-estado-revision-soft text-estado-revision', icono: Search },
  ENTREVISTA: { clases: 'bg-estado-entrevista-soft text-estado-entrevista', icono: CalendarClock },
  SELECCIONADO: { clases: 'bg-estado-seleccionado-soft text-estado-seleccionado', icono: CircleCheck },
  NO_SELECCIONADO: { clases: 'bg-estado-rechazado-soft text-estado-rechazado', icono: CircleX },
}

// Etiqueta con el estado de una postulación (HU-46).
export default function ApplicationStateBadge({ estado }: { estado: EstadoPostulacion }) {
  const { clases, icono: Icono } = ESTILO[estado]
  return (
    <span className={cn('inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-semibold', clases)}>
      <Icono aria-hidden="true" className="size-3.5" />
      {ETIQUETA_ESTADO_POSTULACION[estado]}
    </span>
  )
}
