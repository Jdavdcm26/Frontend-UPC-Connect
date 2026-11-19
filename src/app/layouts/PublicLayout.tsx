import { Link, Outlet } from 'react-router-dom'
import AnunciarRuta from '@/app/AnunciarRuta'
import PiePagina from '@/app/layouts/PiePagina'
import SaltarAlContenido from '@/app/layouts/SaltarAlContenido'
import { Button } from '@/components/ui/button'
import { useSession } from '@/features/auth/useSession'
import { RUTAS } from '@/shared/lib/rutas'
import Logo from '@/shared/ui/Logo'

// Diseño para páginas sin sesión: inicio, registro, inicio de sesión.
// Los enlaces de acceso solo se muestran cuando se sabe que no hay sesión.
export default function PublicLayout() {
  const { usuario, cargando } = useSession()

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SaltarAlContenido />
      <AnunciarRuta />
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-2xs">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-4 max-[339px]:px-3 sm:gap-4 sm:px-6 lg:px-8">
          <Logo destino={RUTAS.raiz} subtitulo="Universidad Popular del Cesar" />
          {!cargando && usuario === null && (
            <nav aria-label="Acceso" className="flex items-center gap-1.5 sm:gap-2.5">
              <Button asChild variant="ghost" size="sm" className="px-2.5 font-medium hover:bg-muted/70 sm:px-3">
                <Link to={RUTAS.iniciarSesion}>Iniciar sesión</Link>
              </Button>
              <Button asChild size="sm" className="shadow-xs shadow-primary/20 font-medium">
                <Link to={RUTAS.registro}>Registrarse</Link>
              </Button>
            </nav>
          )}
        </div>
      </header>
      <main
        id="contenido"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 focus:outline-none sm:px-6 lg:px-8 lg:py-8"
      >
        <Outlet />
      </main>
      <PiePagina />
    </div>
  )
}
