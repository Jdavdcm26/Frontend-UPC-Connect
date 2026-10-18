import { Outlet } from 'react-router-dom'

// Diseño común de las pantallas de autenticación: una tarjeta centrada.
export default function AuthLayout() {
  return (
    <div className="mx-auto w-full max-w-md rounded-lg border p-6 shadow-sm">
      <Outlet />
    </div>
  )
}