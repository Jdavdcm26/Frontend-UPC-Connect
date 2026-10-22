import type { ReactNode } from 'react'

type Props = {
  // Título de la pantalla (el único h1).
  titulo: string
  // Frase breve que explica para qué sirve la pantalla.
  descripcion?: string
  // Botones o enlaces de la derecha, por ejemplo «Publicar vacante».
  acciones?: ReactNode
}

// Encabezado de las pantallas internas: título, explicación breve y acciones principales.
export default function EncabezadoPagina({ titulo, descripcion, acciones }: Props) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">{titulo}</h1>
        {descripcion && <p className="max-w-2xl text-muted-foreground">{descripcion}</p>}
      </div>
      {acciones}
    </header>
  )
}
