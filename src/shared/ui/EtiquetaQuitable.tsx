import { X } from 'lucide-react'

type Props = {
  texto: string
  // Dato extra a continuación del texto, por ejemplo el nivel de una habilidad.
  detalle?: string
  // Texto para lectores de pantalla del botón, por ejemplo «Quitar React».
  etiquetaQuitar: string
  onQuitar: () => void
  deshabilitado?: boolean
}

// Etiqueta (un elemento de lista) con un botón para quitarla. Se usa en habilidades e intereses del formulario.
export default function EtiquetaQuitable({ texto, detalle, etiquetaQuitar, onQuitar, deshabilitado = false }: Props) {
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border bg-background py-1 pr-1.5 pl-3 text-sm font-medium">
      <span className="break-words">
        {texto}
        {detalle && <span className="font-normal text-muted-foreground"> · {detalle}</span>}
      </span>
      <button
        type="button"
        aria-label={etiquetaQuitar}
        disabled={deshabilitado}
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
        onClick={onQuitar}
      >
        <X aria-hidden="true" className="size-3.5" />
      </button>
    </li>
  )
}
