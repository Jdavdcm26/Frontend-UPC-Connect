import { CircleAlert, CircleCheck } from 'lucide-react'
import { cn } from 'cn'
import type { ReactNode } from 'react'

type Props = {
  tipo: 'error' | 'exito'
  children: ReactNode
}

// Cada tipo trae su color, su icono y su rol: el error se anuncia de inmediato (alert) y el éxito
// de forma amable (status). Los textos son oscuros sobre fondo suave (contraste de 4,5:1 o más).
const TIPOS = {
  error: { caja: 'border-red-200 bg-red-50 text-destructive', Icono: CircleAlert, rol: 'alert' },
  exito: { caja: 'border-primary/20 bg-primary-soft text-primary', Icono: CircleCheck, rol: 'status' },
} as const

// Mensaje de un formulario o de una pantalla de estado: un error del servidor o la confirmación de una acción.
export default function MensajeFormulario({ tipo, children }: Props) {
  const { caja, Icono, rol } = TIPOS[tipo]
  return (
    <div role={rol} className={cn('flex items-start gap-2.5 rounded-lg border p-3 text-left text-sm', caja)}>
      <Icono aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div className="space-y-1">{children}</div>
    </div>
  )
}
