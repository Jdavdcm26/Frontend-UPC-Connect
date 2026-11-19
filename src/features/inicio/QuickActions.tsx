import { ArrowUpRight, type LucideIcon } from 'lucide-react'
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
      <ul className="grid gap-4 sm:grid-cols-3">
        {accesos.map(({ ruta, titulo, descripcion, icono: Icono }, indice) => (
          <li key={ruta} className="entrar" style={{ animationDelay: `${indice * 70}ms` }}>
            <Link
              to={ruta}
              className="tarjeta elevable group relative flex h-full min-h-36 flex-col justify-between gap-4 overflow-hidden p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span aria-hidden="true" className="absolute -right-8 -top-10 size-28 rounded-full bg-primary/5 transition-transform duration-300 group-hover:scale-125 motion-reduce:transform-none" />
              <div className="relative flex items-start justify-between gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-linear-to-br from-primary/15 to-emerald-500/8 text-primary shadow-2xs transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none">
                  <Icono aria-hidden="true" className="size-6" />
                </span>
                <span className="font-heading text-3xl font-extrabold text-foreground/10">0{indice + 1}</span>
              </div>
              <div className="relative space-y-1">
                <span className="flex items-center gap-1.5 text-base font-bold text-foreground transition-colors group-hover:text-primary">
                  {titulo}
                  <ArrowUpRight aria-hidden="true" className="size-4 opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none" />
                </span>
                <span className="block text-xs leading-relaxed text-muted-foreground sm:text-sm">{descripcion}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
