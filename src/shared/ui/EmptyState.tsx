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
    <div className="flex flex-col items-center gap-3 rounded-xl border-[1.5px] border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <span className="flex size-10 items-center justify-center rounded-full bg-background text-muted-foreground ring-1 ring-border">
        <Inbox aria-hidden="true" className="size-5" />
      </span>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">{titulo}</h2>
        {descripcion && <p className="text-sm text-muted-foreground">{descripcion}</p>}
      </div>
      {accion}
    </div>
  )
}
