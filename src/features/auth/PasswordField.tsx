import { Check, Circle } from 'lucide-react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import FormField from '@/shared/ui/FormField'

const MINIMO = 10

type Props = {
  id: string
  etiqueta: string
  // Lo que la persona lleva escrito, para marcar los requisitos.
  valor: string
  registro: UseFormRegisterReturn
  error?: string
}

// Campo de contraseña nueva con sus requisitos visibles (HU-01 / FE-10).
export default function PasswordField({ id, etiqueta, valor, registro, error }: Props) {
  const cumple = valor.length >= MINIMO
  const idRequisitos = `${id}-requisitos`

  return (
    <div className="space-y-1.5">
      <FormField id={id} etiqueta={etiqueta} error={error}>
        {(campo) => (
          <Input
            type="password"
            autoComplete="new-password"
            {...campo}
            {...registro}
            aria-describedby={[campo['aria-describedby'], idRequisitos].filter(Boolean).join(' ')}
          />
        )}
      </FormField>
      <ul id={idRequisitos} className="text-sm text-muted-foreground">
        <li className={cumple ? 'flex items-center gap-1.5 font-medium text-primary' : 'flex items-center gap-1.5'}>
          {cumple ? <Check aria-hidden="true" className="size-4" /> : <Circle aria-hidden="true" className="size-4" />}
          <span>Al menos {MINIMO} caracteres</span>
          <span className="sr-only">{cumple ? '(cumplido)' : '(pendiente)'}</span>
        </li>
      </ul>
    </div>
  )
}