import { Outlet } from 'react-router-dom'

// Diseño para páginas sin sesión: inicio, registro, inicio de sesión.
export default function PublicLayout() {
  return (
    <div className="min-h-screen">
      <header className="border-b p-4 font-bold">UPC Connect</header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}