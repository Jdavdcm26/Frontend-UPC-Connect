import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

type Props = {
  // A dónde lleva el logo (la página de inicio de quien lo ve).
  destino: string
  // Texto pequeño bajo el nombre, por ejemplo "Portal del candidato".
  subtitulo?: string
}

// Marca de la app: birrete sobre fondo verde suave y el nombre. Es un enlace al inicio.
export default function Logo({ destino, subtitulo }: Props) {
  return (
    <Link
      to={destino}
      className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        <GraduationCap aria-hidden="true" className="size-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-base font-semibold tracking-tight text-foreground">UPC Connect</span>
        {subtitulo && <span className="hidden text-xs text-muted-foreground sm:block">{subtitulo}</span>}
      </span>
    </Link>
  )
}
