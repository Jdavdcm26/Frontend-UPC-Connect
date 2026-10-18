import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import FormField from '@/shared/ui/FormField'

type Opcion = {
  valor: string
  etiqueta: string
}

type Props = {
  id: string
  etiqueta: string
  placeholder: string
  opciones: Opcion[]
  valor: string
  onChange: (valor: string) => void
  error?: string
}

// Lista desplegable con etiqueta y error accesibles.
export default function SelectField({ id, etiqueta, placeholder, opciones, valor, onChange, error }: Props) {
  return (
    <FormField id={id} etiqueta={etiqueta} error={error}>
      {(campo) => (
        <Select value={valor} onValueChange={onChange}>
          <SelectTrigger className="w-full" {...campo}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {opciones.map((opcion) => (
              <SelectItem key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  )
}