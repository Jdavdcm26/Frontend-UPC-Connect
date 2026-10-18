import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Carrera } from '@/features/perfil/tipos'
import FormField from '@/shared/ui/FormField'

type Props = {
  carreras: Carrera[]
  valor: string
  onChange: (valor: string) => void
  error?: string
}

// Lista de carreras (HU-09 / FE-15).
// Solo se ofrecen las activas; la ya elegida se conserva aunque se haya desactivado.
export default function CareerSelect({ carreras, valor, onChange, error }: Props) {
  const opciones = carreras.filter((carrera) => carrera.activa || String(carrera.id) === valor)

  return (
    <FormField id="carrera" etiqueta="Carrera" error={error}>
      {(campo) => (
        <Select value={valor} onValueChange={onChange}>
          <SelectTrigger className="w-full" {...campo}>
            <SelectValue placeholder="Elige tu carrera" />
          </SelectTrigger>
          <SelectContent>
            {opciones.map((carrera) => (
              <SelectItem key={carrera.id} value={String(carrera.id)}>
                {carrera.nombre}
                {carrera.activa ? '' : ' (ya no se ofrece)'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  )
}