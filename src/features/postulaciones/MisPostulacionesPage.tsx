import { useInfiniteQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ApplicationList from '@/features/postulaciones/ApplicationList'
import { CLAVE_MIS_POSTULACIONES, listarMisPostulaciones } from '@/features/postulaciones/postulacionesApi'
import { RUTAS } from '@/shared/lib/rutas'
import EmptyState from '@/shared/ui/EmptyState'
import ErrorState from '@/shared/ui/ErrorState'

// Historial de postulaciones de la persona con sesión (HU-46 / FE-24).
// Se actualiza al recargar o al volver a la pestaña, porque en el Release 1 no hay tiempo real.
export default function MisPostulacionesPage() {
  const postulaciones = useInfiniteQuery({
    queryKey: CLAVE_MIS_POSTULACIONES,
    queryFn: ({ pageParam }) => listarMisPostulaciones(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (ultima) => ultima.siguiente,
  })

  const lista = postulaciones.data?.pages.flatMap((pagina) => pagina.postulaciones) ?? []

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">Mis postulaciones</h1>

      {postulaciones.isPending && (
        <div className="space-y-3" role="status" aria-label="Cargando postulaciones">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {postulaciones.isError && (
        <ErrorState
          mensaje="No pudimos cargar tus postulaciones. Intenta de nuevo en un momento."
          onReintentar={() => void postulaciones.refetch()}
        />
      )}

      {postulaciones.isSuccess && lista.length === 0 && (
        <EmptyState
          titulo="Aún no te has postulado"
          descripcion="Cuando te postules a una vacante, aquí podrás seguir su estado."
          accion={
            <Button asChild variant="outline">
              <Link to={RUTAS.vacantes}>Ver vacantes</Link>
            </Button>
          }
        />
      )}

      {lista.length > 0 && <ApplicationList postulaciones={lista} />}

      {postulaciones.hasNextPage && (
        <div className="text-center">
          <Button
            variant="outline"
            disabled={postulaciones.isFetchingNextPage}
            onClick={() => void postulaciones.fetchNextPage()}
          >
            {postulaciones.isFetchingNextPage ? 'Cargando...' : 'Cargar más'}
          </Button>
        </div>
      )}
    </section>
  )
}