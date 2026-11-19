import { Inbox } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  titulo: string
  descripcion?: string
  accion?: ReactNode
}

// Estado vacío: se muestra cuando no hay datos que listar. Caja punteada con un icono, el título,
// una explicación y, si hace falta, la acción para salir del vacío.
export default function EmptyState({ titulo, descripcion, accion }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border-[1.5px] border-dashed border-border bg-card/60 p-8 text-center backdrop-blur-xs sm:p-10">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground ring-1 ring-border">
        <Inbox aria-hidden="true" className="size-5.5" />
      </span>
      <div className="space-y-1.5">
        <h2 className="text-lg font-bold text-foreground">{titulo}</h2>
        {descripcion && <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{descripcion}</p>}
      </div>
      {accion}
    </div>
  )
}
