import type { LucideIcon } from 'lucide-react'
import { cn } from 'cn'
import type { ReactNode } from 'react'

type Tono = 'exito' | 'error' | 'info'

const TONOS: Record<Tono, string> = {
  exito: 'bg-primary/10 text-primary border border-primary/20',
  error: 'bg-destructive/10 text-destructive border border-destructive/20',
  info: 'bg-primary/10 text-primary border border-primary/20',
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
    <section className="flex flex-col items-center gap-5 text-center">
      <span className={cn('flex size-16 items-center justify-center rounded-2xl shadow-xs', TONOS[tono])}>
        <Icono aria-hidden="true" className="size-8" />
      </span>
      <h1 className="text-2xl font-extrabold tracking-tight">{titulo}</h1>
      {children}
    </section>
  )
}
