import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import DashboardCard from '@/features/inicio/DashboardCard'
import QuickActions, { type Acceso } from '@/features/inicio/QuickActions'
import RecentApplications from '@/features/inicio/RecentApplications'
import { CLAVE_PERFIL, obtenerPerfil } from '@/features/perfil/perfilApi'
import { CLAVE_MIS_POSTULACIONES, listarMisPostulaciones } from '@/features/postulaciones/postulacionesApi'
import { RUTAS } from '@/shared/lib/rutas'
import EmptyState from '@/shared/ui/EmptyState'
import ErrorState from '@/shared/ui/ErrorState'

// Cuántas postulaciones se muestran en el inicio.
const CANTIDAD_RECIENTES = 3

const ACCESOS: Acceso[] = [
  { ruta: RUTAS.vacantes, titulo: 'Vacantes', descripcion: 'Busca y filtra ofertas para tu carrera.' },
  { ruta: RUTAS.perfil, titulo: 'Mi perfil', descripcion: 'Revisa y actualiza tus datos.' },
  { ruta: RUTAS.misPostulaciones, titulo: 'Mis postulaciones', descripcion: 'Sigue el estado de cada una.' },
]

// Inicio del candidato (HU-03 / FE-28): accesos y postulaciones recientes.
export default function InicioCandidatoPage() {
  const perfil = useQuery({ queryKey: CLAVE_PERFIL, queryFn: obtenerPerfil })
  // La clave cuelga de la de «mis postulaciones»: al postularse o recargar, se actualiza sola.
  const postulaciones = useQuery({
    queryKey: [...CLAVE_MIS_POSTULACIONES, 'recientes'],
    queryFn: () => listarMisPostulaciones(null),
  })

  const recientes = postulaciones.data?.postulaciones.slice(0, CANTIDAD_RECIENTES) ?? []

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">{perfil.data ? `Hola, ${perfil.data.nombres}` : 'Inicio'}</h1>

      <QuickActions accesos={ACCESOS} />

      <DashboardCard titulo="Postulaciones recientes" enlace={{ ruta: RUTAS.misPostulaciones, etiqueta: 'Ver todas' }}>
        {postulaciones.isPending && (
          <div className="space-y-3" role="status" aria-label="Cargando postulaciones">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {postulaciones.isError && (
          <ErrorState
            mensaje="No pudimos cargar tus postulaciones. Intenta de nuevo en un momento."
            onReintentar={() => void postulaciones.refetch()}
          />
        )}

        {postulaciones.isSuccess && recientes.length === 0 && (
          <EmptyState
            titulo="Aún no te has postulado"
            descripcion="Explora las vacantes y postúlate a la que más te interese."
            accion={
              <Button asChild variant="outline">
                <Link to={RUTAS.vacantes}>Ver vacantes</Link>
              </Button>
            }
          />
        )}

        {recientes.length > 0 && <RecentApplications postulaciones={recientes} />}
      </DashboardCard>
    </div>
  )
}
