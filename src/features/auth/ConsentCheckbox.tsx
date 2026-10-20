import type { Ref } from 'react'
import { Link } from 'react-router-dom'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { VERSION_POLITICA } from '@/features/auth/politica'
import { RUTAS } from '@/shared/lib/rutas'

type Props = {
  checked: boolean
  onChange: (valor: boolean) => void
  error?: string
  inputRef?: Ref<HTMLButtonElement>
}

const ID = 'acepta-politica'
const ID_ERROR = 'acepta-politica-error'

// Casilla de consentimiento con enlace a la política vigente (HU-07 / FE-14).
export default function ConsentCheckbox({ checked, onChange, error, inputRef }: Props) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-start gap-2">
        <Checkbox
          ref={inputRef}
          id={ID}
          checked={checked}
          onCheckedChange={(valor) => onChange(valor === true)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? ID_ERROR : undefined}
        />
        <Label htmlFor={ID} className="font-normal leading-snug">
          Acepto la{' '}
          <Link
            to={RUTAS.politicaPrivacidad}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            política de privacidad
            <span className="sr-only"> (se abre en otra pestaña)</span>
          </Link>{' '}
          (versión {VERSION_POLITICA}).
        </Label>
      </div>
      {error && (
        <p id={ID_ERROR} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}