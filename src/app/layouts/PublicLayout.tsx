import { Link, Outlet } from 'react-router-dom'
import AnunciarRuta from '@/app/AnunciarRuta'
import SaltarAlContenido from '@/app/layouts/SaltarAlContenido'
import { Button } from '@/components/ui/button'
import { useSession } from '@/features/auth/useSession'
import { RUTAS } from '@/shared/lib/rutas'

// Diseño para páginas sin sesión: inicio, registro, inicio de sesión.
// Los enlaces de acceso solo se muestran cuando se sabe que no hay sesión.
export default function PublicLayout() {
  const { usuario, cargando } = useSession()

  return (
    <div className="min-h-screen">
      <SaltarAlContenido />
      <AnunciarRuta />
      <header className="flex items-center justify-between border-b p-4">
        <Link to={RUTAS.raiz} className="font-bold">
          UPC Connect
        </Link>
        {!cargando && usuario === null && (
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
      <main id="contenido" tabIndex={-1} className="p-4 focus:outline-none">
        <Outlet />
      </main>
    </div>
  )
}
