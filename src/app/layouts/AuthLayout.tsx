import { Outlet } from 'react-router-dom'

// Diseño común de las pantallas de autenticación: una tarjeta centrada con diseño premium.
export default function AuthLayout() {
  return (
    <div className="relative mx-auto mt-4 w-full max-w-md overflow-hidden rounded-2xl border border-border/80 bg-card/95 p-6 shadow-lg backdrop-blur-xs sm:mt-8 sm:p-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-emerald-500 to-teal-500"
      />
      <Outlet />
    </div>
  )
}
