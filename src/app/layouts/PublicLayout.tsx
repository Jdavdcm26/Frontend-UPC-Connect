import { useQuery } from '@tanstack/react-query'
import { Link, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CLAVE_SESION, obtenerSesion } from '@/features/auth/sesionApi'
import { RUTAS } from '@/shared/lib/rutas'

// Diseño para páginas sin sesión: inicio, registro, inicio de sesión.
// Los enlaces de acceso solo se muestran cuando se sabe que no hay sesión.
export default function PublicLayout() {
  const sesion = useQuery({ queryKey: CLAVE_SESION, queryFn: obtenerSesion })

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b p-4">
        <Link to={RUTAS.raiz} className="font-bold">
          UPC Connect
        </Link>
        {sesion.data === null && (
          <nav aria-label="Acceso" className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to={RUTAS.iniciarSesion}>Iniciar sesión</Link>
            </Button>
            <Button asChild size="sm">
              <Link to={RUTAS.registro}>Registrarse</Link>
            </Button>
          </nav>
        )}
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}