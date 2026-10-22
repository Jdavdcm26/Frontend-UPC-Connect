import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

export type Acceso = {
  ruta: string
  titulo: string
  descripcion: string
  icono: LucideIcon
}

// Accesos directos a lo que más se usa en cada rol (HU-03 / FE-28 y FE-29).
export default function QuickActions({ accesos }: { accesos: Acceso[] }) {
  return (
    <nav aria-label="Accesos rápidos">
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
        {accesos.map(({ ruta, titulo, descripcion, icono: Icono }) => (
          <li key={ruta}>
            <Link
              to={ruta}
              className="group flex h-full items-center gap-4 rounded-xl border bg-card p-4 shadow-sm outline-none sm:flex-col sm:items-start sm:gap-3 sm:p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icono aria-hidden="true" className="size-6" />
              </span>
              <span className="space-y-1">
                <span className="block text-lg font-semibold">{titulo}</span>
                <span className="block text-sm text-muted-foreground">{descripcion}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
