import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

type Props = {
  // A dónde lleva el logo (la página de inicio de quien lo ve).
  destino: string
  // Texto pequeño bajo el nombre, por ejemplo "Portal del candidato".
  subtitulo?: string
}

// Marca de la app: birrete sobre fondo verde suave y el nombre. Es un enlace al inicio.
// En pantallas de menos de 390 px se oculta el birrete para que el encabezado no se desborde.
export default function Logo({ destino, subtitulo }: Props) {
  return (
    <Link
      to={destino}
      className="group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <span className="hidden size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary via-primary to-emerald-700 text-white shadow-xs shadow-primary/25 transition-transform duration-200 group-hover:scale-105 min-[390px]:flex motion-reduce:transform-none">
        <GraduationCap aria-hidden="true" className="size-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="flex items-center gap-1.5 text-base font-bold tracking-tight whitespace-nowrap text-foreground max-[339px]:text-sm">
          UPC Connect
          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary tracking-wide">
            UPC
          </span>
        </span>
        {subtitulo && <span className="hidden text-xs text-muted-foreground sm:block">{subtitulo}</span>}
      </span>
    </Link>
  )
}
