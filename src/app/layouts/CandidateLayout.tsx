import { Link, Outlet } from 'react-router-dom'
import CerrarSesionBoton from '@/features/auth/CerrarSesionBoton'
import { RUTAS } from '@/shared/lib/rutas'

// Diseño para estudiantes y egresados con sesión iniciada.
export default function CandidateLayout() {
  return (
    <div className="min-h-screen">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b p-4">
        <span className="font-bold">UPC Connect · Candidato</span>
        <nav aria-label="Principal" className="flex items-center gap-4 text-sm">
          <Link to={RUTAS.inicioCandidato} className="underline-offset-4 hover:underline">
            Inicio
          </Link>
          <Link to={RUTAS.perfil} className="underline-offset-4 hover:underline">
            Mi perfil
          </Link>
          <CerrarSesionBoton />
        </nav>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}