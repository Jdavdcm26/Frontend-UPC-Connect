import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from 'cn'
import { Skeleton } from '@/components/ui/skeleton'

type Tono = 'verde' | 'esmeralda' | 'indigo' | 'ambar'

const TONOS: Record<Tono, string> = {
  verde: 'from-primary/18 to-emerald-500/8 text-primary ring-primary/20',
  esmeralda: 'from-emerald-500/18 to-teal-500/8 text-emerald-700 ring-emerald-600/20 dark:text-emerald-300 dark:ring-emerald-400/25',
  indigo: 'from-indigo-500/16 to-violet-500/8 text-indigo-700 ring-indigo-600/20 dark:text-indigo-300 dark:ring-indigo-400/25',
  ambar: 'from-amber-500/18 to-orange-500/8 text-ambar ring-amber-600/20 dark:text-amber-300 dark:ring-amber-400/25',
}

type Props = {
  titulo: string
  valor: number | string | null
  icono: LucideIcon
  tono?: Tono
  detalle?: string
  ruta?: string
  cargando?: boolean
}

// Cifra real de la pantalla, presentada como tarjeta. Si no hay dato (falló su consulta) no se inventa
// un cero: se oculta en la página que la usa.
export default function TarjetaEstadistica({
  titulo,
  valor,
  icono: Icono,
  tono = 'verde',
  detalle,
  ruta,
  cargando = false,
}: Props) {
  const contenido = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br ring-1 shadow-2xs',
            TONOS[tono],
          )}
        >
          <Icono aria-hidden="true" className="size-5" />
        </span>
        {ruta && (
          <span aria-hidden="true" className="text-xs font-semibold text-muted-foreground transition-colors group-hover:text-primary">
            Ver más →
          </span>
        )}
      </div>
      <div className="space-y-1">
        {cargando ? (
          <Skeleton className="h-9 w-16" />
        ) : (
          <p className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">{valor ?? '—'}</p>
        )}
        <p className="text-sm font-semibold text-foreground/80">{titulo}</p>
        {detalle && <p className="text-xs leading-relaxed text-muted-foreground">{detalle}</p>}
      </div>
    </>
  )

  const clases = cn(
    'tarjeta entrar group flex h-full flex-col justify-between gap-5 p-5',
    ruta && 'elevable outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  )

  if (ruta) {
    return (
      <Link to={ruta} className={clases}>
        {contenido}
      </Link>
    )
  }
  return <div className={clases}>{contenido}</div>
}
