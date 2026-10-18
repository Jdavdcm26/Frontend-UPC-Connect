import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import type { Carrera } from '@/features/perfil/tipos'

type Props = {
  // Solo las carreras activas: una oferta nueva no se dirige a programas cerrados.
  carreras: Carrera[]
  valor: string[]
  onChange: (valor: string[]) => void
  error?: string
}

// Carreras a las que se dirige la oferta; se exige al menos una (HU-41 / FE-19).
export default function TargetCareersField({ carreras, valor, onChange, error }: Props) {
  function alternar(id: string, marcada: boolean) {
    onChange(marcada ? [...valor, id] : valor.filter((actual) => actual !== id))
  }

  return (
    <fieldset aria-describedby={error ? 'carreras-error' : undefined} className="space-y-2">
      <legend className="text-sm font-medium">Carreras objetivo</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {carreras
          .filter((carrera) => carrera.activa)
          .map((carrera) => {
            const id = String(carrera.id)
            const idCasilla = `carrera-${id}`
            return (
              <div key={id} className="flex items-center gap-2">
                <Checkbox
                  id={idCasilla}
                  checked={valor.includes(id)}
                  onCheckedChange={(marcada) => alternar(id, marcada === true)}
                />
                <Label htmlFor={idCasilla} className="font-normal">
                  {carrera.nombre}
                </Label>
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