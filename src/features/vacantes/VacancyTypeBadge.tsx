import { Briefcase, GraduationCap, Handshake, type LucideIcon } from 'lucide-react'
import { cn } from 'cn'
import { ETIQUETA_TIPO, type TipoVacante } from '@/features/vacantes/tipos'

// Cada tipo de oferta tiene su propio color para reconocerlo de un vistazo.
const ESTILO: Record<TipoVacante, { clases: string; icono: LucideIcon }> = {
  VACANTE: { clases: 'bg-estado-revision-soft text-estado-revision', icono: Briefcase },
  PRACTICA: { clases: 'bg-primary-soft text-primary', icono: GraduationCap },
  PASANTIA: { clases: 'bg-ambar-soft text-ambar', icono: Handshake },
}

// Etiqueta con el tipo de oferta: vacante, práctica o pasantía.
export default function VacancyTypeBadge({ tipo }: { tipo: TipoVacante }) {
  const { clases, icono: Icono } = ESTILO[tipo]
  return (
    <span className={cn('inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-semibold', clases)}>
      <Icono aria-hidden="true" className="size-3.5" />
      {ETIQUETA_TIPO[tipo]}
    </span>
  )
}
