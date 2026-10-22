import { ImagePlus, X } from 'lucide-react'
import { useRef, type ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { ACEPTA_IMAGENES, LIMITES_PUBLICACION } from '@/features/publicaciones/limites'

// Imagen elegida en el computador, con la dirección temporal de su vista previa.
export type ImagenElegida = {
  id: string
  archivo: File
  url: string
}

type Props = {
  id: string
  // Imágenes ya mostradas: las elegidas o, al editar, las que ya tiene la publicación.
  vistas: { id: string; url: string; nombre: string }[]
  // Cuántas imágenes caben todavía.
  restantes: number
  onElegir: (archivos: File[]) => void
  onQuitar: (id: string) => void
  ocupado?: boolean
  // Avisos de las imágenes rechazadas (formato, tamaño o máximo) o del servidor.
  errores: string[]
}

// Selector de hasta cuatro imágenes con vista previa y botón para quitar cada una (HU-21).
// El campo de archivo está oculto: lo abre el botón «Agregar imágenes», que sí tiene foco y etiqueta.
export default function ImagePicker({ id, vistas, restantes, onElegir, onQuitar, ocupado = false, errores }: Props) {
  const entrada = useRef<HTMLInputElement>(null)
  const idAyuda = `${id}-ayuda`
  const idError = `${id}-error`

  function elegir(evento: ChangeEvent<HTMLInputElement>) {
    const archivos = Array.from(evento.target.files ?? [])
    // Se limpia para poder elegir otra vez el mismo archivo después de quitarlo.
    evento.target.value = ''
    if (archivos.length > 0) onElegir(archivos)
  }

  return (
    <div className="space-y-3">
      {vistas.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {vistas.map((vista, i) => (
            <li key={vista.id} className="relative overflow-hidden rounded-lg border bg-muted">
              <img src={vista.url} alt={`Imagen ${i + 1}: ${vista.nombre}`} className="aspect-square w-full object-cover" />
              <button
                type="button"
                aria-label={`Quitar la imagen ${i + 1}: ${vista.nombre}`}
                disabled={ocupado}
                onClick={() => onQuitar(vista.id)}
                className="absolute top-1.5 right-1.5 inline-flex size-8 items-center justify-center rounded-full bg-background/90 text-foreground shadow outline-none hover:bg-background focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={entrada}
        id={id}
        type="file"
        accept={ACEPTA_IMAGENES}
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={elegir}
      />
      <Button
        type="button"
        variant="outline"
        disabled={ocupado || restantes === 0}
        aria-describedby={[idAyuda, errores.length > 0 && idError].filter(Boolean).join(' ')}
        onClick={() => entrada.current?.click()}
      >
        <ImagePlus aria-hidden="true" />
        Agregar imágenes
      </Button>
      <p id={idAyuda} className="text-sm text-muted-foreground">
        Hasta {LIMITES_PUBLICACION.imagenes} imágenes JPG, PNG o WebP de máximo 5 MB cada una.{' '}
        {restantes === 0 ? 'Ya llegaste al máximo.' : `Puedes agregar ${restantes} más.`}
      </p>
      {errores.length > 0 && (
        <div id={idError} role="alert" className="space-y-1 text-sm text-destructive">
          {errores.map((mensaje) => (
            <p key={mensaje}>{mensaje}</p>
          ))}
        </div>
      )}
    </div>
  )
}
