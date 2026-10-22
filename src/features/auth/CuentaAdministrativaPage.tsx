import { ShieldCheck } from 'lucide-react'
import { Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import CerrarSesionBoton from '@/features/auth/CerrarSesionBoton'
import { rutaInicioPorRol } from '@/features/auth/rutaPorRol'
import { useSession } from '@/features/auth/useSession'
import { RUTAS } from '@/shared/lib/rutas'
import PantallaEstado from '@/shared/ui/PantallaEstado'

// Aviso para cuentas de administración y moderación, que no usan esta aplicación.
// Un candidato o una empresa que llegue aquí va a su propio inicio.
export default function CuentaAdministrativaPage() {
  const { usuario } = useSession()

  if (usuario && usuario.rol !== 'admin' && usuario.rol !== 'moderador') {
    return <Navigate to={rutaInicioPorRol(usuario.rol)} replace />
  }

  return (
    <div className="mx-auto max-w-md py-8">
      <PantallaEstado icono={ShieldCheck} titulo="Cuenta administrativa">
        <p>Tu cuenta se gestiona desde el panel de administración.</p>
        {usuario?.rol === 'admin' ? (
          <Button asChild>
            <a href={RUTAS.panelAdministracion}>Ir al panel de administración</a>
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">
            Las cuentas de moderación todavía no tienen pantallas en esta aplicación.
          </p>
        )}
        <CerrarSesionBoton />
      </PantallaEstado>
    </div>
  )
}