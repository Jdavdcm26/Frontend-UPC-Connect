import { Outlet } from 'react-router-dom'

// Diseño para cuentas de empresa con sesión iniciada.
export default function CompanyLayout() {
  return (
    <div className="min-h-screen">
      <header className="border-b p-4 font-bold">UPC Connect · Empresa</header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}