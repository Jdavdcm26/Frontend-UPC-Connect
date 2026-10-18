import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import AvisoCuenta from '@/features/auth/AvisoCuenta'
import { useSession } from '@/features/auth/useSession'
import { RUTAS } from '@/shared/lib/rutas'

// Protege un grupo de rutas: exige sesión iniciada y cuenta activa.
export default function RequireAuth() {
  const { usuario, cargando } = useSession()
  const ubicacion = useLocation()

  if (cargando) return <Skeleton className="h-10 w-full" />

  // Sin sesión: va a iniciar sesión y guarda la ruta para volver después.
  if (!usuario) {
    return (
      <Navigate
        to={RUTAS.iniciarSesion}
        replace
        state={{ desde: ubicacion.pathname + ubicacion.search }}
      />
    )
  }

  if (usuario.estado !== 'ACTIVO') return <AvisoCuenta estado={usuario.estado} />

  return <Outlet />
}