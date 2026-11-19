import { Hash, PenSquare, Sparkles, UsersRound } from 'lucide-react'
import { cn } from 'cn'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import type { FiltrosPublicaciones } from '@/features/publicaciones/filtros'
import type { Categoria } from '@/features/publicaciones/tipos'
import { RUTAS } from '@/shared/lib/rutas'

type Props = {
  categorias: Categoria[]
  filtros: FiltrosPublicaciones
  onCambiar: (filtros: FiltrosPublicaciones) => void
  esCandidato: boolean
}

// Barra lateral del feed. Solo muestra datos que ya existen: las categorías del servidor,
// el filtro activo y un acceso a publicar. No hay perfiles recomendados en la API actual.
export default function ComunidadSidebar({ categorias, filtros, onCambiar, esCandidato }: Props) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-26 lg:self-start" aria-label="Comunidad y categorías">
      {esCandidato && (
        <div className="degradado-institucional relative overflow-hidden rounded-[var(--radio-tarjeta)] p-5 text-white shadow-banner">
          <div aria-hidden="true" className="rejilla-sutil absolute inset-0" />
          <Sparkles aria-hidden="true" className="relative size-6 text-emerald-200" />
          <h2 className="relative mt-3 text-lg font-bold">Comparte con tu comunidad</h2>
          <p className="relative mt-1 text-xs leading-relaxed text-white/80">
            Una idea, un servicio o un equipo: tu aporte puede abrirle puertas a otra persona.
          </p>
          <Button asChild className="relative mt-4 w-full bg-white text-primary hover:bg-emerald-50">
            <Link to={RUTAS.nuevaPublicacion}>
              <PenSquare aria-hidden="true" />
              Publicar
            </Link>
          </Button>
        </div>
      )}

      <section className="tarjeta space-y-4 p-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-linear-to-br from-primary/15 to-emerald-500/8 text-primary shadow-2xs">
            <UsersRound aria-hidden="true" className="size-4.5" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-foreground">Comunidad UPC</h2>
            <p className="text-[11px] text-muted-foreground">Espacio institucional</p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Estudiantes y egresados comparten aquí ideas, servicios y búsquedas de equipo.
        </p>
      </section>

      {categorias.length > 0 && (
        <section className="tarjeta space-y-4 p-5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-linear-to-br from-primary/15 to-emerald-500/8 text-primary shadow-2xs">
              <Hash aria-hidden="true" className="size-4.5" />
            </span>
            <h2 className="text-sm font-bold text-foreground">Explora por categoría</h2>
          </div>
          <ul className="flex flex-wrap gap-2">
            {categorias.map((categoria) => {
              const activa = filtros.categoriaId === categoria.id
              return (
                <li key={categoria.id}>
                  <button
                    type="button"
                    aria-pressed={activa}
                    onClick={() => onCambiar({ ...filtros, categoriaId: activa ? '' : categoria.id })}
                    className={cn(
                      'rounded-full border px-3 py-1.5 text-xs font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
                      activa
                        ? 'border-primary/25 bg-primary text-white shadow-card'
                        : 'border-border/70 bg-background/70 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary',
                    )}
                  >
                    {categoria.nombre}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </aside>
  )
}
