import { NavLink, Outlet } from 'react-router-dom'
import AnunciarRuta from '@/app/AnunciarRuta'
import { claseEnlaceMenu } from '@/app/layouts/estilosMenu'
import MenuMovil from '@/app/layouts/MenuMovil'
import PiePagina from '@/app/layouts/PiePagina'
import SaltarAlContenido from '@/app/layouts/SaltarAlContenido'
import type { Enlace } from '@/app/navegacion'
import CerrarSesionBoton from '@/features/auth/CerrarSesionBoton'
import { useSession } from '@/features/auth/useSession'
import AvatarIniciales from '@/shared/ui/AvatarIniciales'
import Logo from '@/shared/ui/Logo'

type Props = {
  // Texto pequeño bajo el logo, por ejemplo "Portal del candidato".
  subtitulo: string
  enlaces: Enlace[]
}

// Diseño de las pantallas con sesión: encabezado con el menú del rol, el contenido y el pie (FE-18).
// En el celular el menú pasa a un panel lateral que se abre con un botón.
export default function AppShell({ subtitulo, enlaces }: Props) {
  const { usuario } = useSession()

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SaltarAlContenido />
      <AnunciarRuta />
      <header className="sticky top-0 z-40 border-b border-border/60 bg-card/85 shadow-card backdrop-blur-xl">
        <div className="mx-auto flex h-17 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo destino={enlaces[0].ruta} subtitulo={subtitulo} />
          <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
            {enlaces.map(({ ruta, etiqueta, icono: Icono }) => (
              <NavLink
                key={ruta}
                to={ruta}
                end
                className={({ isActive }) => claseEnlaceMenu(isActive)}
              >
                {Icono && <Icono aria-hidden="true" className="size-4" />}
                {etiqueta}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 md:flex">
              <CerrarSesionBoton />
              {usuario && (
                <span className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-primary/15 to-emerald-500/10 p-0.5 ring-1 ring-primary/20">
                  <AvatarIniciales correo={usuario.correo} />
                </span>
              )}
            </div>
            <MenuMovil enlaces={enlaces} correo={usuario?.correo} />
          </div>
        </div>
        <div aria-hidden="true" className="h-0.5 w-full bg-linear-to-r from-primary via-emerald-500 to-transparent" />
      </header>
      <main
        id="contenido"
        tabIndex={-1}
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-7 focus:outline-none sm:px-6 lg:px-8 lg:py-9"
      >
        <Outlet />
      </main>
      <PiePagina />
    </div>
  )
}
