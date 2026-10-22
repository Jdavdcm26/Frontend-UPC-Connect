import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { RUTAS } from '@/shared/lib/rutas'
import PantallaEstado from '@/shared/ui/PantallaEstado'

// Se muestra cuando la persona no tiene permiso para ver la página (403).
export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-md py-8">
      <PantallaEstado icono={ShieldAlert} tono="error" titulo="Sin permiso">
        <p className="text-muted-foreground">No tienes permiso para ver esta página.</p>
        <Button asChild>
          <Link to={RUTAS.raiz}>Volver al inicio</Link>
        </Button>
      </PantallaEstado>
    </div>
  )
}
