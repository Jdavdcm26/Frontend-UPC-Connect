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
    <section className="space-y-4 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{titulo}</h2>
        {enlace && (
          <Link to={enlace.ruta} className={`${claseEnlace} inline-flex shrink-0 items-center gap-1 whitespace-nowrap text-sm`}>
            {enlace.etiqueta}
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}
