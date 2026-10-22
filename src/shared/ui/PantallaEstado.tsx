import type { LucideIcon } from 'lucide-react'
import { cn } from 'cn'
import type { ReactNode } from 'react'

type Tono = 'exito' | 'error' | 'info'

const TONOS: Record<Tono, string> = {
  exito: 'bg-primary-soft text-primary',
  error: 'bg-red-50 text-destructive',
  info: 'bg-tint-strong text-primary',
}

type Props = {
  icono: LucideIcon
  tono?: Tono
  titulo: string
  children?: ReactNode
}

// Pantalla centrada con un icono grande, el título y lo que haga falta debajo (texto y acciones).
// La usan los avisos de verificación de correo, "sin permiso", "no encontrada" y similares.
export default function PantallaEstado({ icono: Icono, tono = 'info', titulo, children }: Props) {
  return (
    <section className="flex flex-col items-center gap-4 text-center">
      <span className={cn('flex size-16 items-center justify-center rounded-full', TONOS[tono])}>
        <Icono aria-hidden="true" className="size-8" />
      </span>
      <h1 className="text-2xl font-bold">{titulo}</h1>
      {children}
    </section>
  )
}
