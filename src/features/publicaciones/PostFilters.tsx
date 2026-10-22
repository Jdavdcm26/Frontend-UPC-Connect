import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FILTROS_PUBLICACIONES_VACIOS, type FiltrosPublicaciones } from '@/features/publicaciones/filtros'
import { ETIQUETA_TIPO_PUBLICACION, TIPOS_PUBLICACION, type Categoria } from '@/features/publicaciones/tipos'
import SelectField from '@/shared/ui/SelectField'

// Valor de la opción que quita el filtro (la lista desplegable no admite valores vacíos).
const TODOS = 'TODOS'

const OPCIONES_TIPO = [
  { valor: TODOS, etiqueta: 'Todos' },
  ...TIPOS_PUBLICACION.map((valor) => ({ valor, etiqueta: ETIQUETA_TIPO_PUBLICACION[valor] })),
]

type Props = {
  filtros: FiltrosPublicaciones
  categorias: Categoria[]
  onCambiar: (filtros: FiltrosPublicaciones) => void
}

// Filtros del feed por tipo y categoría. Son solo dos listas, así que se aplican al elegir.
export default function PostFilters({ filtros, categorias, onCambiar }: Props) {
  const opcionesCategoria = [{ valor: TODOS, etiqueta: 'Todas' }, ...categorias.map((c) => ({ valor: c.id, etiqueta: c.nombre }))]
  const hayFiltros = filtros.tipo !== '' || filtros.categoriaId !== ''

  return (
    <div role="group" aria-label="Filtros de publicaciones" className="rounded-xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
        <SelectField
          id="filtro-tipo-publicacion"
          etiqueta="Tipo"
          placeholder="Todos"
          opciones={OPCIONES_TIPO}
          valor={filtros.tipo || TODOS}
          onChange={(v) => onCambiar({ ...filtros, tipo: v === TODOS ? '' : (v as FiltrosPublicaciones['tipo']) })}
        />
        <SelectField
          id="filtro-categoria"
          etiqueta="Categoría"
          placeholder="Todas"
          opciones={opcionesCategoria}
          valor={filtros.categoriaId || TODOS}
          onChange={(v) => onCambiar({ ...filtros, categoriaId: v === TODOS ? '' : v })}
        />
        <div className="flex items-end">
          <Button
            type="button"
            variant="outline"
            disabled={!hayFiltros}
            onClick={() => onCambiar({ ...FILTROS_PUBLICACIONES_VACIOS, alcance: filtros.alcance })}
          >
            <RotateCcw aria-hidden="true" />
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  )
}
