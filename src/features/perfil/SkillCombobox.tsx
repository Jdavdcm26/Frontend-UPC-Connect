import { useId, useState, type KeyboardEvent, type RefObject } from 'react'
import { Input } from '@/components/ui/input'
import { etiquetaTipo } from '@/features/perfil/formato'
import type { HabilidadCatalogo } from '@/features/perfil/tipos'
import FormField from '@/shared/ui/FormField'

type Props = {
  id: string
  etiqueta: string
  ayuda?: string
  error?: string
  texto: string
  onTextoChange: (texto: string) => void
  // Sugerencias para el texto escrito. Es undefined mientras se buscan.
  sugerencias: HabilidadCatalogo[] | undefined
  // Ids de las habilidades que ya están en el perfil: se ven, pero no se pueden elegir de nuevo.
  yaAgregadas: Set<string>
  onElegir: (habilidad: HabilidadCatalogo) => void
  deshabilitado?: boolean
  inputRef?: RefObject<HTMLInputElement | null>
}

// Campo de texto con lista de sugerencias (patrón «combobox» de WAI-ARIA):
// flechas para recorrer, Enter para elegir, Escape para cerrar.
export default function SkillCombobox({
  id,
  etiqueta,
  ayuda,
  error,
  texto,
  onTextoChange,
  sugerencias,
  yaAgregadas,
  onElegir,
  deshabilitado = false,
  inputRef,
}: Props) {
  const idLista = useId()
  const [abierto, setAbierto] = useState(false)
  // Posición de la sugerencia resaltada. -1 si ninguna.
  const [activa, setActiva] = useState(-1)

  const opciones = sugerencias ?? []
  const hayTexto = texto.trim() !== ''
  const visible = abierto && hayTexto
  // La lista solo existe cuando hay sugerencias que mostrar.
  const hayLista = visible && opciones.length > 0
  const idOpcion = (posicion: number) => `${idLista}-${posicion}`
  const sePuedeElegir = (posicion: number) => !yaAgregadas.has(opciones[posicion].id)

  // Busca la siguiente sugerencia que se pueda elegir, dando la vuelta al llegar al final.
  function mover(paso: 1 | -1) {
    if (opciones.length === 0) return
    let posicion = activa
    for (let intento = 0; intento < opciones.length; intento++) {
      posicion = (posicion + paso + opciones.length) % opciones.length
      if (sePuedeElegir(posicion)) {
        setActiva(posicion)
        return
      }
    }
  }

  function elegir(habilidad: HabilidadCatalogo) {
    if (yaAgregadas.has(habilidad.id)) return
    onElegir(habilidad)
    setAbierto(false)
    setActiva(-1)
  }

  function alPulsarTecla(evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key === 'ArrowDown' || evento.key === 'ArrowUp') {
      evento.preventDefault()
      if (!visible && hayTexto) setAbierto(true)
      mover(evento.key === 'ArrowDown' ? 1 : -1)
    } else if (evento.key === 'Enter') {
      // Enter nunca envía el formulario desde este campo: solo elige la sugerencia resaltada.
      evento.preventDefault()
      if (visible && activa >= 0 && activa < opciones.length) elegir(opciones[activa])
    } else if (evento.key === 'Escape' && visible) {
      evento.preventDefault()
      setAbierto(false)
      setActiva(-1)
    }
  }

  // Lo que anuncian los lectores de pantalla.
  const anuncio = !hayTexto
    ? ''
    : sugerencias === undefined
      ? 'Buscando habilidades...'
      : opciones.length === 0
        ? 'No encontramos habilidades con ese nombre.'
        : `${opciones.length} sugerencias. Usa las flechas arriba y abajo para recorrerlas.`

  return (
    <FormField id={id} etiqueta={etiqueta} ayuda={ayuda} error={error}>
      {(campo) => (
        <div className="relative">
          <Input
            {...campo}
            ref={inputRef}
            role="combobox"
            aria-expanded={hayLista}
            aria-controls={idLista}
            aria-autocomplete="list"
            aria-activedescendant={hayLista && activa >= 0 ? idOpcion(activa) : undefined}
            autoComplete="off"
            disabled={deshabilitado}
            value={texto}
            onChange={(evento) => {
              onTextoChange(evento.target.value)
              setAbierto(true)
              setActiva(-1)
            }}
            onKeyDown={alPulsarTecla}
            onBlur={() => setAbierto(false)}
          />

          <p role="status" className="sr-only">
            {visible ? anuncio : ''}
          </p>

          {hayLista && (
            <ul
              id={idLista}
              role="listbox"
              aria-label={etiqueta}
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
            >
              {opciones.map((habilidad, posicion) => {
                const agregada = yaAgregadas.has(habilidad.id)
                return (
                  <li
                    key={habilidad.id}
                    id={idOpcion(posicion)}
                    role="option"
                    aria-selected={posicion === activa}
                    aria-disabled={agregada}
                    // Con mouseDown se evita que el campo pierda el foco antes del clic.
                    onMouseDown={(evento) => evento.preventDefault()}
                    onClick={() => elegir(habilidad)}
                    className={`flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm ${
                      agregada ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-accent'
                    } ${posicion === activa ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    <span>{habilidad.nombre}</span>
                    <span className="text-xs text-muted-foreground">
                      {agregada ? 'Ya agregada' : etiquetaTipo(habilidad.tipo)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}

          {visible && sugerencias?.length === 0 && (
            <p
              aria-hidden="true"
              className="absolute z-10 mt-1 w-full rounded-lg border bg-popover p-3 text-sm text-muted-foreground shadow-md"
            >
              No encontramos habilidades con ese nombre.
            </p>
          )}
        </div>
      )}
    </FormField>
  )
}
