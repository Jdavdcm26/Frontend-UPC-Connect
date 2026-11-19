import { Link } from 'react-router-dom'
import { RUTAS } from '@/shared/lib/rutas'

// Pie de página de todas las pantallas. Solo lleva enlaces que existen en la app.
export default function PiePagina() {
  return (
    <footer className="relative border-t border-border/70 bg-background/60 backdrop-blur-xs">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-foreground">Universidad Popular del Cesar · UPC Connect</p>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
              Oficial
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Valledupar, Cesar, Colombia · © {new Date().getFullYear()} Todos los derechos reservados.
          </p>
        </div>
        <nav aria-label="Información legal" className="flex items-center gap-4">
          <Link
            to={RUTAS.politicaPrivacidad}
            className="rounded text-xs font-medium text-muted-foreground underline-offset-4 outline-none transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Política de privacidad
          </Link>
        </nav>
      </div>
    </footer>
  )
}
