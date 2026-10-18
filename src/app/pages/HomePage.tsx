import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { RUTAS } from '@/shared/lib/rutas'

// Página de inicio (pública). Se reemplazará por la landing real.
export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">UPC Connect</h1>
      <p>Red profesional de la comunidad de la Universidad Popular del Cesar.</p>
      <Button asChild>
        <Link to={RUTAS.registro}>Comenzar</Link>
      </Button>
      <p className="text-sm">
        ¿Ya tienes cuenta?{' '}
        <Link to={RUTAS.iniciarSesion} className="underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}