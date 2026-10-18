import type { ReactNode } from 'react'
import { Link } from 'react-router'

type Props = {
  titulo: string
  // Enlace opcional a la lista completa, por ejemplo «Ver todas».
  enlace?: { ruta: string; etiqueta: string }
  children: ReactNode
}

// Recuadro de una sección de los paneles de inicio (HU-03 / FE-28 y FE-29).
export default function DashboardCard({ titulo, enlace, children }: Props) {
  return (
    <section className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">{titulo}</h2>
        {enlace && (
          <Link to={enlace.ruta} className="text-sm underline">
            {enlace.etiqueta}
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}
