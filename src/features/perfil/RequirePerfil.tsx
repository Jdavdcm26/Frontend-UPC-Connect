import { useQuery } from '@tanstack/react-query'
import { Navigate, Outlet } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import { CLAVE_PERFIL, obtenerPerfil } from '@/features/perfil/perfilApi'
import { RUTAS } from '@/shared/lib/rutas'

// Protege las pantallas que exigen perfil: sin perfil lleva a crearlo (HU-09, primer acceso).
export default function RequirePerfil() {
  const perfil = useQuery({ queryKey: CLAVE_PERFIL, queryFn: obtenerPerfil })

  if (perfil.isPending) return <Skeleton className="h-10 w-full" />

  if (perfil.isError) {
    return (
      <p role="alert" className="text-center text-destructive">
        No pudimos cargar tu perfil. Recarga la página para intentar de nuevo.
      </p>
    )
  }

  if (perfil.data === null) return <Navigate to={RUTAS.perfilEditar} replace />

  return <Outlet />
}