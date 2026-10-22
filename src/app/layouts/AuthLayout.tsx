import { Outlet } from 'react-router-dom'

// Diseño común de las pantallas de autenticación: una tarjeta centrada con una franja de color arriba.
export default function AuthLayout() {
  return (
    <div className="relative mx-auto mt-2 w-full max-w-md overflow-hidden rounded-xl border bg-card p-6 shadow-sm sm:mt-6 sm:p-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-primary to-amber-400"
      />
      <Outlet />
    </div>
  )
}
