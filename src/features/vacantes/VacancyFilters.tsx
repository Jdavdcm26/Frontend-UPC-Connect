import { RotateCcw, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Carrera } from '@/features/perfil/tipos'
import { FILTROS_VACIOS, type FiltrosVacantes } from '@/features/vacantes/filtros'
import {
  ETIQUETA_MODALIDAD,
  ETIQUETA_TIPO,
  MODALIDADES,
  TIPOS_VACANTE,
} from '@/features/vacantes/tipos'
import FormField from '@/shared/ui/FormField'
import SelectField from '@/shared/ui/SelectField'

// Valor de la opción que quita el filtro (la lista desplegable no admite valores vacíos).
const TODOS = 'TODOS'
const OPCION_TODOS = { valor: TODOS, etiqueta: 'Todos' }

const OPCIONES_TIPO = [
  OPCION_TODOS,
  ...TIPOS_VACANTE.map((valor) => ({ valor, etiqueta: ETIQUETA_TIPO[valor] })),
]
const OPCIONES_MODALIDAD = [
  OPCION_TODOS,
  ...MODALIDADES.map((valor) => ({ valor, etiqueta: ETIQUETA_MODALIDAD[valor] })),
]

type Props = {
  filtros: FiltrosVacantes
  carreras: Carrera[]
  onAplicar: (filtros: FiltrosVacantes) => void
}

// Filtros del listado de vacantes. Se aplican al pulsar «Buscar» (FE-21).
export default function VacancyFilters({ filtros, carreras, onAplicar }: Props) {
  const [borrador, setBorrador] = useState(filtros)

  const cambiar = <K extends keyof FiltrosVacantes>(campo: K, valor: FiltrosVacantes[K]) => {
    setBorrador((anterior) => ({ ...anterior, [campo]: valor }))
  }

  const opcionesCarrera = [
    OPCION_TODOS,
    ...carreras.filter((c) => c.activa).map((c) => ({ valor: String(c.id), etiqueta: c.nombre })),
  ]

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    onAplicar(borrador)
  }

  function limpiar() {
    setBorrador(FILTROS_VACIOS)
    onAplicar(FILTROS_VACIOS)
  }

  return (
    <form
      onSubmit={enviar}
      aria-label="Filtros de vacantes"
      className="rounded-xl border bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <FormField id="filtro-texto" etiqueta="Buscar">
          {(campo) => (
            <Input
              placeholder="Cargo o palabra clave"
              value={borrador.texto}
              onChange={(e) => cambiar('texto', e.target.value)}
              {...campo}
            />
          )}
        </FormField>
        <FormField id="filtro-ciudad" etiqueta="Ciudad">
          {(campo) => (
            <Input value={borrador.ciudad} onChange={(e) => cambiar('ciudad', e.target.value)} {...campo} />
          )}
        </FormField>
        <SelectField
          id="filtro-carrera"
          etiqueta="Carrera"
          placeholder="Todas"
          opciones={opcionesCarrera}
          valor={borrador.carreraId || TODOS}
          onChange={(v) => cambiar('carreraId', v === TODOS ? '' : v)}
        />
        <SelectField
          id="filtro-tipo"
          etiqueta="Tipo de oferta"
          placeholder="Todos"
          opciones={OPCIONES_TIPO}
          valor={borrador.tipo || TODOS}
          onChange={(v) => cambiar('tipo', v === TODOS ? '' : (v as FiltrosVacantes['tipo']))}
        />
        <SelectField
          id="filtro-modalidad"
          etiqueta="Modalidad"
          placeholder="Todas"
          opciones={OPCIONES_MODALIDAD}
          valor={borrador.modalidad || TODOS}
          onChange={(v) => cambiar('modalidad', v === TODOS ? '' : (v as FiltrosVacantes['modalidad']))}
        />
        <div className="flex flex-wrap items-end gap-2">
          <Button type="submit">
            <Search aria-hidden="true" />
            Buscar
          </Button>
          <Button type="button" variant="outline" onClick={limpiar}>
            <RotateCcw aria-hidden="true" />
            Limpiar
          </Button>
        </div>
      </div>
    </form>
  )
}