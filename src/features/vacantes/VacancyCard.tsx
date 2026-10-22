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
    <article className="relative flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring motion-reduce:transition-none">
      <span className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary sm:flex">
        <Building2 aria-hidden="true" className="size-6" />
      </span>
      <div className="min-w-0 flex-1 space-y-2">
        <VacancyTypeBadge tipo={vacante.tipo} />
        <h2 className="text-lg font-semibold">
          <Link
            to={`${RUTAS.vacantes}/${vacante.id}`}
            className="break-words outline-none after:absolute after:inset-0 after:content-[''] hover:underline"
          >
            {vacante.titulo}
          </Link>
        </h2>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          <DatoIcono icono={Building2}>{vacante.empresa}</DatoIcono>
          <DatoIcono icono={MapPin}>
            {ETIQUETA_MODALIDAD[vacante.modalidad]} · {vacante.ciudad}
          </DatoIcono>
          <DatoIcono icono={CalendarClock}>Cierra el {formatearDia(vacante.fechaCierre)}</DatoIcono>
        </div>
      </div>
      <ArrowRight aria-hidden="true" className="hidden size-5 shrink-0 text-muted-foreground sm:block" />
    </article>
  )
}
