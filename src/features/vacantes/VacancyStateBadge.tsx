import { CircleDot, Lock, Pause, type LucideIcon } from 'lucide-react'
import { cn } from 'cn'
import { ETIQUETA_ESTADO, type EstadoVacante } from '@/features/vacantes/tipos'

// Color e ícono de cada estado de la vacante. El texto siempre dice el estado.
const ESTILO: Record<EstadoVacante, { clases: string; icono: LucideIcon }> = {
  ACTIVA: { clases: 'bg-primary-soft text-primary', icono: CircleDot },
  PAUSADA: { clases: 'bg-ambar-soft text-ambar', icono: Pause },
  CERRADA: { clases: 'border border-border bg-estado-recibida-soft text-estado-recibida', icono: Lock },
}

// Etiqueta con el estado de una vacante.
export default function VacancyStateBadge({ estado }: { estado: EstadoVacante }) {
  const { clases, icono: Icono } = ESTILO[estado]
  return (
    <span className={cn('inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-semibold', clases)}>
      <Icono aria-hidden="true" className="size-3.5" />
      {ETIQUETA_ESTADO[estado]}
    </span>
  )
}
