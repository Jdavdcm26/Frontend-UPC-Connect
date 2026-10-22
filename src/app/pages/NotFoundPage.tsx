import { SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { RUTAS } from '@/shared/lib/rutas'
import PantallaEstado from '@/shared/ui/PantallaEstado'

// Se muestra cuando la dirección no existe (error 404).
export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md py-8">
      <PantallaEstado icono={SearchX} titulo="Página no encontrada">
        <p className="text-muted-foreground">La dirección que buscas no existe.</p>
        <Button asChild>
          <Link to={RUTAS.raiz}>Volver al inicio</Link>
        </Button>
      </PantallaEstado>
    </div>
  )
}
