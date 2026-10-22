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
    <header className="space-y-2 rounded-xl border bg-card p-6 shadow-sm">
      <h1 className="text-2xl font-bold sm:text-3xl">{titulo}</h1>
      {detalle && <p className="font-medium text-primary">{detalle}</p>}
      {children && <p className="max-w-2xl text-muted-foreground">{children}</p>}
    </header>
  )
}
