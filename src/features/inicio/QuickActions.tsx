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
              className="group flex h-full items-center gap-4 rounded-2xl border border-border/80 bg-card/95 p-4 shadow-xs outline-none backdrop-blur-xs sm:flex-col sm:items-start sm:gap-3.5 sm:p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 to-emerald-500/10 text-primary border border-primary/20 shadow-2xs transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none">
                <Icono aria-hidden="true" className="size-6" />
              </span>
              <span className="space-y-1">
                <span className="block text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                  {titulo}
                </span>
                <span className="block text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {descripcion}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
