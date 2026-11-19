import { ArrowRight, Building2, CalendarClock, CheckCircle2, MapPin, MapPinned } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from 'cn'
import { ETIQUETA_MODALIDAD, type Vacante } from '@/features/vacantes/tipos'
import VacancyTypeBadge from '@/features/vacantes/VacancyTypeBadge'
import { formatearDia, hoyLocal } from '@/shared/lib/fechas'
import { RUTAS } from '@/shared/lib/rutas'
import DatoIcono from '@/shared/ui/DatoIcono'

type Props = {
  vacante: Vacante
  // Versión compacta para el panel de inicio: misma información esencial, menos altura.
  compact?: boolean
}

function diasParaCerrar(fecha: string) {
  const fin = new Date(`${fecha}T23:59:59`).getTime()
  const hoy = new Date(`${hoyLocal()}T00:00:00`).getTime()
  return Math.ceil((fin - hoy) / 86_400_000)
}

// Tarjeta de una vacante en el listado (FE-21). El enlace del título se estira sobre toda la tarjeta
// (after:absolute) para que el área de clic sea grande y lleve al detalle (FE-22).
export default function VacancyCard({ vacante, compact = false }: Props) {
  const dias = diasParaCerrar(vacante.fechaCierre)
  const cierraPronto = vacante.abierta && dias >= 0 && dias <= 7

  return (
    <article
      className={cn(
        'group relative flex gap-4 rounded-[var(--radio-tarjeta)] border border-border/70 bg-card shadow-card transition-all duration-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring motion-reduce:transform-none motion-reduce:transition-none',
        compact ? 'p-4 hover:border-primary/30 hover:shadow-lift' : 'elevable p-5 sm:p-6',
      )}
    >
      <span
        className={cn(
          'hidden shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-linear-to-br from-primary/15 to-emerald-500/8 text-primary shadow-2xs transition-transform duration-200 group-hover:scale-105 min-[540px]:flex motion-reduce:transform-none',
          compact ? 'size-11' : 'size-13',
        )}
      >
        <Building2 aria-hidden="true" className={compact ? 'size-5' : 'size-6.5'} />
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <VacancyTypeBadge tipo={vacante.tipo} />
          {cierraPronto && (
            <span className="inline-flex h-6 items-center gap-1 rounded-full border border-ambar/25 bg-ambar-soft px-2.5 text-xs font-semibold text-ambar">
              <CalendarClock aria-hidden="true" className="size-3.5" />
              Cierra pronto
            </span>
          )}
          {!vacante.abierta && (
            <span className="inline-flex h-6 items-center rounded-full border border-border bg-muted/60 px-2.5 text-xs font-semibold text-muted-foreground">
              No recibe postulaciones
            </span>
          )}
          {vacante.yaPostulado && (
            <span className="inline-flex h-6 items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 text-xs font-semibold text-primary">
              <CheckCircle2 aria-hidden="true" className="size-3.5" />
              Ya te postulaste
            </span>
          )}
        </div>
        <h2 className={cn('font-bold tracking-tight text-foreground', compact ? 'text-base' : 'text-lg')}>
          <Link
            to={`${RUTAS.vacantes}/${vacante.id}`}
            className="break-words outline-none after:absolute after:inset-0 after:content-[''] group-hover:text-primary transition-colors"
          >
            {vacante.titulo}
          </Link>
        </h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
          <DatoIcono icono={Building2}>{vacante.empresa}</DatoIcono>
          <DatoIcono icono={MapPin}>
            {ETIQUETA_MODALIDAD[vacante.modalidad]} · {vacante.ciudad}
          </DatoIcono>
          {!compact && <DatoIcono icono={MapPinned}>Cierra el {formatearDia(vacante.fechaCierre)}</DatoIcono>}
        </div>
      </div>
      <span className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-all duration-200 group-hover:bg-primary group-hover:text-white group-hover:translate-x-0.5 sm:flex motion-reduce:transform-none">
        <ArrowRight aria-hidden="true" className="size-4" />
      </span>
    </article>
  )
}
