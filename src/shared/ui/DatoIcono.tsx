import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  icono: LucideIcon
  children: ReactNode
}

// Dato corto con un icono decorativo (empresa, ciudad, fecha...). El texto siempre dice el dato.
export default function DatoIcono({ icono: Icono, children }: Props) {
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
      <Icono aria-hidden="true" className="size-4 shrink-0" />
      <span className="min-w-0 break-words">{children}</span>
    </span>
  )
}
