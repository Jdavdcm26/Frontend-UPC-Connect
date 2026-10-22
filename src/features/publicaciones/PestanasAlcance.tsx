import { Globe, UserCheck, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from 'cn'
import { filtrosPublicacionesAUrl, type FiltrosPublicaciones } from '@/features/publicaciones/filtros'
import type { Alcance } from '@/features/publicaciones/tipos'
import { RUTAS } from '@/shared/lib/rutas'

const PESTANAS: { alcance: Alcance; etiqueta: string; icono: LucideIcon }[] = [
  { alcance: 'comunidad', etiqueta: 'Comunidad', icono: Globe },
  { alcance: 'seguidos', etiqueta: 'Siguiendo', icono: UserCheck },
]

// «Comunidad» o «Siguiendo» (HU-24). Son enlaces: cambian la URL y conservan los demás filtros.
// La actual se marca con aria-current y en negrita, no solo con color.
export default function PestanasAlcance({ filtros }: { filtros: FiltrosPublicaciones }) {
  return (
    <nav aria-label="Qué publicaciones ver" className="inline-flex rounded-xl border bg-card p-1 shadow-sm">
      {PESTANAS.map(({ alcance, etiqueta, icono: Icono }) => {
        const actual = filtros.alcance === alcance
        const consulta = filtrosPublicacionesAUrl({ ...filtros, alcance }).toString()
        return (
          <Link
            key={alcance}
            to={`${RUTAS.publicaciones}${consulta ? `?${consulta}` : ''}`}
            aria-current={actual ? 'page' : undefined}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
              actual ? 'bg-primary-soft font-semibold text-primary' : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icono aria-hidden="true" className="size-4" />
            {etiqueta}
          </Link>
        )
      })}
    </nav>
  )
}
