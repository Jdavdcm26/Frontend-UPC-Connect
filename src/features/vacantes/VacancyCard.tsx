import { ArrowRight, Building2, CalendarClock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ETIQUETA_MODALIDAD, type Vacante } from '@/features/vacantes/tipos'
import VacancyTypeBadge from '@/features/vacantes/VacancyTypeBadge'
import { formatearDia } from '@/shared/lib/fechas'
import { RUTAS } from '@/shared/lib/rutas'
import DatoIcono from '@/shared/ui/DatoIcono'

// Tarjeta de una vacante en el listado (FE-21). El enlace del título se estira sobre toda la tarjeta
// (after:absolute) para que el área de clic sea grande y lleve al detalle (FE-22).
export default function VacancyCard({ vacante }: { vacante: Vacante }) {
  return (
    <article className="group relative flex items-center gap-4 rounded-2xl border border-border/80 bg-card/95 p-5 shadow-xs backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring motion-reduce:transform-none motion-reduce:transition-none sm:p-6">
      <span className="hidden size-13 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary/12 to-emerald-500/5 text-primary border border-primary/20 shadow-2xs transition-transform duration-200 group-hover:scale-105 min-[540px]:flex motion-reduce:transform-none">
        <Building2 aria-hidden="true" className="size-6.5" />
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <VacancyTypeBadge tipo={vacante.tipo} />
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          <Link
            to={`${RUTAS.vacantes}/${vacante.id}`}
            className="break-words outline-none after:absolute after:inset-0 after:content-[''] group-hover:text-primary transition-colors"
          >
            {vacante.titulo}
          </Link>
        </h2>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
          <DatoIcono icono={Building2}>{vacante.empresa}</DatoIcono>
          <DatoIcono icono={MapPin}>
            {ETIQUETA_MODALIDAD[vacante.modalidad]} · {vacante.ciudad}
          </DatoIcono>
          <DatoIcono icono={CalendarClock}>Cierra el {formatearDia(vacante.fechaCierre)}</DatoIcono>
        </div>
      </div>
      <span className="hidden size-9 shrink-0 items-center justify-center rounded-full bg-muted/60 text-muted-foreground transition-all duration-200 group-hover:bg-primary group-hover:text-white group-hover:translate-x-0.5 sm:flex motion-reduce:transform-none">
        <ArrowRight aria-hidden="true" className="size-4" />
      </span>
    </article>
  )
}
