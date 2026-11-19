import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { claseEnlace } from '@/shared/ui/estilosEnlace'

type Props = {
  titulo: string
  // Enlace opcional a la lista completa, por ejemplo «Ver todas».
  enlace?: { ruta: string; etiqueta: string }
  children: ReactNode
}

// Recuadro de una sección de los paneles de inicio (HU-03 / FE-28 y FE-29).
export default function DashboardCard({ titulo, enlace, children }: Props) {
  return (
    <section className="space-y-4 rounded-2xl border border-border/80 bg-card/95 p-5 shadow-xs backdrop-blur-xs transition-shadow sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{titulo}</h2>
        {enlace && (
          <Link to={enlace.ruta} className={`${claseEnlace} inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-semibold`}>
            {enlace.etiqueta}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}
