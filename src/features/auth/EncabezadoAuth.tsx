import type { LucideIcon } from 'lucide-react'

type Props = {
  icono: LucideIcon
  titulo: string
  descripcion?: string
}

// Encabezado de los formularios de autenticación: icono con gradiente, título y una línea de ayuda.
export default function EncabezadoAuth({ icono: Icono, titulo, descripcion }: Props) {
  return (
    <header className="space-y-4">
      <span className="flex size-13 items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 to-emerald-500/10 text-primary border border-primary/20 shadow-2xs">
        <Icono aria-hidden="true" className="size-6.5" />
      </span>
      <div className="space-y-1.5">
        <h1 className="text-2xl font-extrabold tracking-tight">{titulo}</h1>
        {descripcion && <p className="text-sm leading-relaxed text-muted-foreground">{descripcion}</p>}
      </div>
    </header>
  )
}
