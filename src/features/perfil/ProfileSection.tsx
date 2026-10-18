import { useId, type ReactNode } from 'react'

type Props = {
  titulo: string
  children: ReactNode
}

// Bloque con título dentro de «Mi perfil» (HU-09 / FE-16).
export default function ProfileSection({ titulo, children }: Props) {
  const idTitulo = useId()
  return (
    <section aria-labelledby={idTitulo} className="space-y-2">
      <h2 id={idTitulo} className="text-lg font-semibold">
        {titulo}
      </h2>
      {children}
    </section>
  )
}