import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'
import { FILTROS_PUBLICACIONES_VACIOS, type FiltrosPublicaciones } from '@/features/publicaciones/filtros'
import { ETIQUETA_TIPO_PUBLICACION, TIPOS_PUBLICACION, type Categoria } from '@/features/publicaciones/tipos'
import SelectField from '@/shared/ui/SelectField'

// Valor de la opción que quita el filtro (la lista desplegable no admite valores vacíos).
const TODOS = 'TODOS'

const OPCIONES_TIPO = [
  { valor: '', etiqueta: 'Todos' },
  ...TIPOS_PUBLICACION.map((valor) => ({ valor, etiqueta: ETIQUETA_TIPO_PUBLICACION[valor] })),
]

type Props = {
  filtros: FiltrosPublicaciones
  categorias: Categoria[]
  onCambiar: (filtros: FiltrosPublicaciones) => void
}

// Filtros del feed por tipo y categoría. Son solo dos criterios, así que se aplican al elegir.
export default function PostFilters({ filtros, categorias, onCambiar }: Props) {
  const opcionesCategoria = [{ valor: TODOS, etiqueta: 'Todas' }, ...categorias.map((c) => ({ valor: c.id, etiqueta: c.nombre }))]
  const hayFiltros = filtros.tipo !== '' || filtros.categoriaId !== ''

  return (
    <section role="group" aria-label="Filtros de publicaciones" className="tarjeta space-y-4 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-linear-to-br from-primary/15 to-emerald-500/10 text-primary shadow-2xs">
            <SlidersHorizontal aria-hidden="true" className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-foreground">Filtra el feed</h2>
            <p className="text-[11px] text-muted-foreground">Encuentra lo que te interesa</p>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={!hayFiltros}
          onClick={() => onCambiar({ ...FILTROS_PUBLICACIONES_VACIOS, alcance: filtros.alcance })}
        >
          <RotateCcw aria-hidden="true" />
          Limpiar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo de publicación">
        {OPCIONES_TIPO.map((opcion) => {
          const activa = filtros.tipo === opcion.valor
          return (
            <button
              key={opcion.valor || 'todos'}
              type="button"
              aria-pressed={activa}
              onClick={() => onCambiar({ ...filtros, tipo: opcion.valor as FiltrosPublicaciones['tipo'] })}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs font-semibold outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none',
                activa
                  ? 'border-primary/25 bg-primary text-primary-foreground shadow-card'
                  : 'border-border/70 bg-background/70 text-muted-foreground hover:border-primary/30 hover:bg-primary/5 hover:text-primary',
              )}
            >
              {opcion.etiqueta}
            </button>
          )
        })}
      </div>

      <div className="max-w-xs">
        <SelectField
          id="filtro-categoria"
          etiqueta="Categoría"
          placeholder="Todas"
          opciones={opcionesCategoria}
          valor={filtros.categoriaId || TODOS}
          onChange={(v) => onCambiar({ ...filtros, categoriaId: v === TODOS ? '' : v })}
        />
      </div>
    </section>
  )
}
