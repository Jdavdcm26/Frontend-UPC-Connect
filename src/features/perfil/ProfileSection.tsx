import type { LucideIcon } from 'lucide-react'
import { useId, type ReactNode } from 'react'

type Props = {
  titulo: string
  // Icono decorativo junto al título.
  icono?: LucideIcon
  // Sin tarjeta propia: para usarla dentro de otra tarjeta (por ejemplo, el panel del candidato).
  plana?: boolean
  children: ReactNode
}

// Bloque con título dentro de «Mi perfil» (HU-09 / FE-16): una tarjeta con su icono y su título.
export default function ProfileSection({ titulo, icono: Icono, plana = false, children }: Props) {
  const idTitulo = useId()
  return (
    <section
      aria-labelledby={idTitulo}
      className={plana ? 'space-y-2' : 'space-y-3 rounded-xl border bg-card p-5 shadow-sm sm:p-6'}
    >
      <h2 id={idTitulo} className={plana ? 'flex items-center gap-2 text-base font-semibold' : 'flex items-center gap-2.5 text-xl font-semibold'}>
        {Icono && (
          <span
            className={
              plana
                ? 'flex size-6 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary'
                : 'flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary'
            }
          >
            <Icono aria-hidden="true" className={plana ? 'size-3.5' : 'size-4.5'} />
          </span>
        )}
        {titulo}
      </h2>
      {children}
    </section>
  )
}
