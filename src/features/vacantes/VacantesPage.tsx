import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CLAVE_CARRERAS, obtenerCarreras } from '@/features/perfil/perfilApi'
import { filtrosAUrl, filtrosDesdeUrl, type FiltrosVacantes } from '@/features/vacantes/filtros'
import VacancyFilters from '@/features/vacantes/VacancyFilters'
import VacancyList from '@/features/vacantes/VacancyList'
import { listarVacantes } from '@/features/vacantes/vacantesApi'

// Listado de vacantes para el candidato. Los filtros viven en la URL (FE-21).
export default function VacantesPage() {
  const [params, setParams] = useSearchParams()
  const filtros = filtrosDesdeUrl(params)

  const carreras = useQuery({ queryKey: CLAVE_CARRERAS, queryFn: obtenerCarreras })

  const vacantes = useInfiniteQuery({
    queryKey: ['vacantes', filtros],
    queryFn: ({ pageParam }) => listarVacantes(filtros, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (ultima) => ultima.siguiente,
  })

  function aplicar(nuevos: FiltrosVacantes) {
    setParams(filtrosAUrl(nuevos))
  }

  const lista = vacantes.data?.pages.flatMap((pagina) => pagina.vacantes) ?? []

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">Vacantes</h1>

      {/* La clave vuelve a cargar los filtros cuando cambia la URL (por ejemplo, con «atrás»). */}
      <VacancyFilters
        key={params.toString()}
        filtros={filtros}
        carreras={carreras.data ?? []}
        onAplicar={aplicar}
      />

      {vacantes.isPending && (
        <div className="space-y-3" role="status" aria-label="Cargando vacantes">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {vacantes.isError && (
        <p role="alert" className="text-center text-destructive">
          No pudimos cargar las vacantes. Intenta de nuevo en un momento.
        </p>
      )}

      {vacantes.isSuccess && lista.length === 0 && (
        <p className="text-muted-foreground">No encontramos vacantes con esos filtros.</p>
      )}

      {lista.length > 0 && <VacancyList vacantes={lista} />}

      {vacantes.hasNextPage && (
        <div className="text-center">
          <Button variant="outline" disabled={vacantes.isFetchingNextPage} onClick={() => void vacantes.fetchNextPage()}>
            {vacantes.isFetchingNextPage ? 'Cargando...' : 'Cargar más'}
          </Button>
        </div>
      )}
    </section>
  )
}