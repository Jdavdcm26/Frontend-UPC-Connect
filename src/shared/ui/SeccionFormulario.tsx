import type { ReactNode } from 'react'

type Props = {
  // Número de la sección dentro del formulario (1, 2, 3...).
  numero: number
  titulo: string
  descripcion?: string
  children: ReactNode
}

// Tarjeta que agrupa una parte de un formulario largo, con su número, su título y una explicación breve.
// No lleva aria-labelledby: así no se vuelve un «landmark» más ni su título se confunde con el de un campo.
export default function SeccionFormulario({ numero, titulo, descripcion, children }: Props) {
  return (
    <section className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-sm font-bold text-primary"
        >
          {numero}
        </span>
        <div className="space-y-0.5">
          <h2 className="text-xl font-semibold">{titulo}</h2>
          {descripcion && <p className="text-sm text-muted-foreground">{descripcion}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}
