import type { Ref } from 'react'
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
  // Para que react-hook-form pueda llevar el foco a la lista cuando tiene un error.
  inputRef?: Ref<HTMLButtonElement>
}

// Lista desplegable con etiqueta y error accesibles.
export default function SelectField({ id, etiqueta, placeholder, opciones, valor, onChange, error, inputRef }: Props) {
  return (
    <FormField id={id} etiqueta={etiqueta} error={error}>
      {(campo) => (
        <Select value={valor} onValueChange={onChange}>
          <SelectTrigger ref={inputRef} className="w-full" {...campo}>
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