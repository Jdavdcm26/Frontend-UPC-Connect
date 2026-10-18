import { Navigate, Outlet } from 'react-router-dom'
import type { Rol } from '@/features/auth/tipos'
import { useSession } from '@/features/auth/useSession'
import { RUTAS } from '@/shared/lib/rutas'

// Protege un grupo de rutas por rol. Va dentro de RequireAuth.
// La autorización real vive en el servidor: aquí solo se evita mostrar pantallas ajenas.
export default function RequireRole({ rol }: { rol: Rol }) {
  const { usuario } = useSession()
  if (usuario?.rol !== rol) return <Navigate to={RUTAS.sinPermiso} replace />
  return <Outlet />
}