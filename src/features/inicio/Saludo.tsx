import type { ReactNode } from 'react'

type Props = {
  // Título de la pantalla (el único h1), por ejemplo «Hola, Ana».
  titulo: string
  // Línea breve bajo el título, por ejemplo la carrera y el semestre.
  detalle?: string
  children?: ReactNode
}

// Tarjeta de bienvenida de los paneles de inicio: el título, un dato de contexto y una frase de ayuda.
export default function Saludo({ titulo, detalle, children }: Props) {
  return (
    <header className="relative space-y-2.5 overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-6 shadow-xs backdrop-blur-xs sm:p-8 before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-linear-to-r before:from-primary before:via-emerald-500 before:to-teal-500">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">{titulo}</h1>
      {detalle && <p className="font-semibold text-primary">{detalle}</p>}
      {children && <p className="max-w-2xl text-muted-foreground sm:text-base leading-relaxed">{children}</p>}
    </header>
  )
}
