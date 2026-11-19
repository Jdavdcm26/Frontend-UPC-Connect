import { ArrowRight, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { claseEnlace } from '@/shared/ui/estilosEnlace'

type Props = {
  titulo: string
  // Enlace opcional a la lista completa, por ejemplo «Ver todas».
  enlace?: { ruta: string; etiqueta: string }
  icono?: LucideIcon
  children: ReactNode
}

// Recuadro de una sección de los paneles de inicio (HU-03 / FE-28 y FE-29).
export default function DashboardCard({ titulo, enlace, icono: Icono, children }: Props) {
  return (
    <section className="tarjeta space-y-5 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-4">
        <h2 className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-foreground sm:text-xl">
          {Icono && (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-linear-to-br from-primary/15 to-emerald-500/10 text-primary shadow-2xs">
              <Icono aria-hidden="true" className="size-4" />
            </span>
          )}
          {titulo}
        </h2>
        {enlace && (
          <Link
            to={enlace.ruta}
            className={`${claseEnlace} group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-primary`}
          >
            {enlace.etiqueta}
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}
