import { Link } from 'react-router-dom'
import { RUTAS } from '@/shared/lib/rutas'

// Pie de página de todas las pantallas. Solo lleva enlaces que existen en la app.
export default function PiePagina() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">Universidad Popular del Cesar · UPC Connect</p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Todos los derechos reservados.</p>
        </div>
        <nav aria-label="Información legal">
          <Link
            to={RUTAS.politicaPrivacidad}
            className="rounded text-sm text-muted-foreground underline-offset-4 outline-none hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Política de privacidad
          </Link>
        </nav>
      </div>
    </footer>
  )
}
