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
        <li className={cumple ? 'text-foreground' : undefined}>
          <span aria-hidden="true">{cumple ? '✓' : '○'}</span> Al menos {MINIMO} caracteres{' '}
          <span className="sr-only">{cumple ? '(cumplido)' : '(pendiente)'}</span>
        </li>
      </ul>
    </div>
  )
}