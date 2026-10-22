import type { Ref } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { Carrera } from '@/features/perfil/tipos'

type Props = {
  // Solo las carreras activas: una oferta nueva no se dirige a programas cerrados.
  carreras: Carrera[]
  valor: string[]
  onChange: (valor: string[]) => void
  error?: string
  // El foco de un error va a la primera casilla.
  inputRef?: Ref<HTMLButtonElement>
}

// Carreras a las que se dirige la oferta; se exige al menos una (HU-41 / FE-19).
export default function TargetCareersField({ carreras, valor, onChange, error, inputRef }: Props) {
  function alternar(id: string, marcada: boolean) {
    onChange(marcada ? [...valor, id] : valor.filter((actual) => actual !== id))
  }

  return (
    <fieldset aria-describedby={error ? 'carreras-error' : undefined} className="space-y-2">
      {/* El título de la sección ya está en la tarjeta; la leyenda queda para los lectores de pantalla. */}
      <legend className="sr-only">Carreras objetivo</legend>
      <p aria-live="polite" className="text-sm font-medium text-primary">
        {valor.length === 0
          ? 'Ninguna carrera seleccionada'
          : `${valor.length} ${valor.length === 1 ? 'carrera seleccionada' : 'carreras seleccionadas'}`}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {carreras
          .filter((carrera) => carrera.activa)
          .map((carrera, posicion) => {
            const id = String(carrera.id)
            const idCasilla = `carrera-${id}`
            const idFacultad = `${idCasilla}-facultad`
            return (
              // La etiqueta se estira sobre toda la tarjeta (after:absolute) para que cualquier clic marque la casilla.
              <div
                key={id}
                className="relative flex items-start gap-3 rounded-lg border bg-background p-3 transition-colors hover:bg-muted/60 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary-soft"
              >
                <Checkbox
                  ref={posicion === 0 ? inputRef : undefined}
                  id={idCasilla}
                  aria-describedby={carrera.facultad ? idFacultad : undefined}
                  className="z-10 mt-0.5"
                  checked={valor.includes(id)}
                  onCheckedChange={(marcada) => alternar(id, marcada === true)}
                />
                <div className="min-w-0 space-y-0.5">
                  <Label htmlFor={idCasilla} className="font-medium after:absolute after:inset-0 after:content-['']">
                    {carrera.nombre}
                  </Label>
                  {carrera.facultad && (
                    <p id={idFacultad} className="text-xs text-muted-foreground">
                      {carrera.facultad}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
      </div>
      {error && (
        <p id="carreras-error" role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </fieldset>
  )
}
