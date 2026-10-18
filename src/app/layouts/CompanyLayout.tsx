import { Outlet } from 'react-router-dom'
import CerrarSesionBoton from '@/features/auth/CerrarSesionBoton'

// Diseño para cuentas de empresa con sesión iniciada.
export default function CompanyLayout() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b p-4">
        <span className="font-bold">UPC Connect · Empresa</span>
        <CerrarSesionBoton />
      </header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}