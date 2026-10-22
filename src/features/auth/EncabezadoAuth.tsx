import type { LucideIcon } from 'lucide-react'

type Props = {
  icono: LucideIcon
  titulo: string
  descripcion?: string
}

// Encabezado de los formularios de autenticación: icono sobre fondo verde suave, título y una línea de ayuda.
export default function EncabezadoAuth({ icono: Icono, titulo, descripcion }: Props) {
  return (
    <header className="space-y-3">
      <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icono aria-hidden="true" className="size-6" />
      </span>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-bold">{titulo}</h1>
        {descripcion && <p className="text-sm text-muted-foreground">{descripcion}</p>}
      </div>
    </header>
  )
}
