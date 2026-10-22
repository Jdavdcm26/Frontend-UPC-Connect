import type { Ref } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SEMESTRE_MAX } from '@/features/perfil/limites'
import FormField from '@/shared/ui/FormField'

type Props = {
  valor: string
  onChange: (valor: string) => void
  error?: string
  inputRef?: Ref<HTMLButtonElement>
}

const SEMESTRES = Array.from({ length: SEMESTRE_MAX }, (_, i) => i + 1)

// Semestre que cursa la persona, del 1 al máximo (HU-09 / FE-15).
export default function SemesterField({ valor, onChange, error, inputRef }: Props) {
  return (
    <FormField id="semestre" etiqueta="Semestre" error={error}>
      {(campo) => (
        <Select value={valor} onValueChange={onChange}>
          <SelectTrigger ref={inputRef} className="w-full" {...campo}>
            <SelectValue placeholder="Elige tu semestre" />
          </SelectTrigger>
          <SelectContent>
            {SEMESTRES.map((numero) => (
              <SelectItem key={numero} value={String(numero)}>
                Semestre {numero}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  )
}