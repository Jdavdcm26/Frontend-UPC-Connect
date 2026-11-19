import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  // Título de la pantalla (el único h1).
  titulo: string
  // Frase breve que explica para qué sirve la pantalla.
  descripcion?: string
  // Botones o enlaces de la derecha, por ejemplo «Publicar vacante».
  acciones?: ReactNode
  // Etiqueta corta sobre el título, por ejemplo «Comunidad UPC».
  eyebrow?: string
  icono?: LucideIcon
}

// Encabezado de las pantallas internas: título, explicación breve y acciones principales.
export default function EncabezadoPagina({ titulo, descripcion, acciones, eyebrow, icono: Icono }: Props) {
  return (
    <header className="relative flex flex-wrap items-end justify-between gap-5 overflow-hidden">
      {Icono && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-3 -top-8 size-28 rounded-full bg-primary/5 blur-2xl"
        />
      )}
      <div className="relative min-w-0 space-y-2">
        {eyebrow && (
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            <span aria-hidden="true" className="h-px w-5 bg-primary/60" />
            {eyebrow}
          </p>
        )}
        <div className="flex items-center gap-3">
          {Icono && (
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-linear-to-br from-primary/15 to-emerald-500/10 text-primary shadow-card">
              <Icono aria-hidden="true" className="size-5" />
            </span>
          )}
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{titulo}</h1>
        </div>
        {descripcion && <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{descripcion}</p>}
      </div>
      {acciones && <div className="relative shrink-0">{acciones}</div>}
    </header>
  )
}
