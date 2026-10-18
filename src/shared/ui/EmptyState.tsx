import type { ReactNode } from 'react'

type Props = {
  titulo: string
  descripcion?: string
  accion?: ReactNode
}

// Estado vacío: se muestra cuando no hay datos que listar.
export default function EmptyState({ titulo, descripcion, accion }: Props) {
  return (
    <div className="space-y-2 rounded-lg border border-dashed p-8 text-center">
      <h2 className="text-lg font-semibold">{titulo}</h2>
      {descripcion && <p className="text-sm text-muted-foreground">{descripcion}</p>}
      {accion}
    </div>
  )
}