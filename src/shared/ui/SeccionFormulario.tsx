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
    <section className="space-y-5 rounded-2xl border border-border/80 bg-card/95 p-5 shadow-xs backdrop-blur-xs sm:p-6">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-linear-to-br from-primary to-emerald-700 text-sm font-bold text-white shadow-xs shadow-primary/25"
        >
          {numero}
        </span>
        <div className="space-y-0.5">
          <h2 className="text-xl font-bold tracking-tight">{titulo}</h2>
          {descripcion && <p className="text-sm leading-relaxed text-muted-foreground">{descripcion}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}
