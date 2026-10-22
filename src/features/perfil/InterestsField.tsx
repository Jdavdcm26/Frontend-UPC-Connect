import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LIMITES } from '@/features/perfil/limites'
import EtiquetaQuitable from '@/shared/ui/EtiquetaQuitable'
import FormField from '@/shared/ui/FormField'

type Props = {
  valor: string[]
  onChange: (valor: string[]) => void
  error?: string
}

// Intereses como etiquetas: se agregan con Enter o con el botón y se quitan con la ×.
export default function InterestsField({ valor, onChange, error }: Props) {
  const [texto, setTexto] = useState('')
  const [aviso, setAviso] = useState<string>()

  function agregar() {
    const interes = texto.trim()
    if (!interes) return
    if (valor.some((actual) => actual.toLowerCase() === interes.toLowerCase())) {
      setAviso('Ese interés ya está en la lista.')
      return
    }
    if (valor.length >= LIMITES.intereses) {
      setAviso(`Puedes agregar máximo ${LIMITES.intereses} intereses.`)
      return
    }
    onChange([...valor, interes])
    setTexto('')
    setAviso(undefined)
  }

  return (
    <div className="space-y-2">
      <FormField
        id="intereses"
        etiqueta="Intereses"
        ayuda="Escribe un interés y pulsa Enter o «Agregar»."
        error={error ?? aviso}
      >
        {(campo) => (
          <div className="flex gap-2">
            <Input
              {...campo}
              value={texto}
              maxLength={LIMITES.interes}
              onChange={(evento) => setTexto(evento.target.value)}
              onKeyDown={(evento) => {
                // Enter agrega el interés en lugar de enviar el formulario.
                if (evento.key === 'Enter') {
                  evento.preventDefault()
                  agregar()
                }
              }}
            />
            <Button type="button" variant="outline" onClick={agregar}>
              <Plus aria-hidden="true" />
              Agregar
            </Button>
          </div>
        )}
      </FormField>

      {valor.length > 0 && (
        <ul className="flex flex-wrap gap-2" aria-label="Intereses agregados">
          {valor.map((interes) => (
            <EtiquetaQuitable
              key={interes}
              texto={interes}
              etiquetaQuitar={`Quitar ${interes}`}
              onQuitar={() => onChange(valor.filter((actual) => actual !== interes))}
            />
          ))}
        </ul>
      )}
    </div>
  )
}