import { Info, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  icono?: LucideIcon
  children: ReactNode
}

// Aviso de estado de una pantalla o tarjeta (por ejemplo, «vacante pausada»). Texto ámbar oscuro sobre
// fondo ámbar suave (contraste de 7:1). No es un error: usa role="status".
export default function AvisoInformativo({ icono: Icono = Info, children }: Props) {
  return (
    <p
      role="status"
      className="flex items-start gap-3 rounded-xl border border-ambar/30 bg-ambar-soft p-3 text-sm font-medium text-ambar sm:p-4"
    >
      <Icono aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <span className="min-w-0 break-words">{children}</span>
    </p>
  )
}
