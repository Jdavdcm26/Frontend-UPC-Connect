import type { ReactNode } from 'react'
import { Label } from '@/components/ui/label'

type Props = {
  id: string
  etiqueta: string
  ayuda?: string
  error?: string
  // Recibe los atributos de accesibilidad que debe llevar el campo.
  children: (campo: {
    id: string
    'aria-invalid': boolean
    'aria-describedby'?: string
  }) => ReactNode
}

// Campo accesible: etiqueta, ayuda y error asociados al control.
// El error usa role="alert" para que los lectores de pantalla lo anuncien.
export default function FormField({ id, etiqueta, ayuda, error, children }: Props) {
  const idAyuda = `${id}-ayuda`
  const idError = `${id}-error`
  const descripcion = [ayuda && idAyuda, error && idError].filter(Boolean).join(' ') || undefined

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{etiqueta}</Label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': descripcion })}
      {ayuda && (
        <p id={idAyuda} className="text-sm text-muted-foreground">
          {ayuda}
        </p>
      )}
      {error && (
        <p id={idError} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}