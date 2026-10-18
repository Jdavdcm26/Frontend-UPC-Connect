import { NavLink, Outlet } from 'react-router-dom'
import AnunciarRuta from '@/app/AnunciarRuta'
import SaltarAlContenido from '@/app/layouts/SaltarAlContenido'
import type { Enlace } from '@/app/navegacion'
import CerrarSesionBoton from '@/features/auth/CerrarSesionBoton'

type Props = {
  // Nombre que aparece a la izquierda del encabezado.
  nombre: string
  enlaces: Enlace[]
}

// Diseño de las pantallas con sesión: encabezado con el menú del rol y el contenido (FE-18).
export default function AppShell({ nombre, enlaces }: Props) {
  return (
    <div className="min-h-screen">
      <SaltarAlContenido />
      <AnunciarRuta />
      <header className="flex flex-wrap items-center justify-between gap-2 border-b p-4">
        <span className="font-bold">{nombre}</span>
        <nav aria-label="Principal" className="flex flex-wrap items-center gap-4 text-sm">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.ruta}
              to={enlace.ruta}
              end
              className={({ isActive }) =>
                isActive ? 'font-semibold underline underline-offset-4' : 'underline-offset-4 hover:underline'
              }
            >
              {enlace.etiqueta}
            </NavLink>
          ))}
          <CerrarSesionBoton />
        </nav>
      </header>
      <main id="contenido" tabIndex={-1} className="p-4 focus:outline-none">
        <Outlet />
      </main>
    </div>
  )
}