import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import VacancyActions from '@/features/vacantes/VacancyActions'
import VacancyStateBadge from '@/features/vacantes/VacancyStateBadge'
import { ETIQUETA_MODALIDAD, ETIQUETA_TIPO, type EstadoVacante } from '@/features/vacantes/tipos'
import { CLAVE_MIS_VACANTES, cambiarEstadoVacante, listarMisVacantes } from '@/features/vacantes/vacantesApi'
import { RUTAS } from '@/shared/lib/rutas'

const MENSAJE_ESTADO: Record<EstadoVacante, string> = {
  ACTIVA: 'Vacante reanudada.',
  PAUSADA: 'Vacante pausada.',
  CERRADA: 'Vacante cerrada.',
}

// Lista de las vacantes de la empresa con sus acciones, por cursor (FE-20).
export default function MisVacantesPage() {
  const queryClient = useQueryClient()
  const vacantes = useInfiniteQuery({
    queryKey: CLAVE_MIS_VACANTES,
    queryFn: ({ pageParam }) => listarMisVacantes(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (ultima) => ultima.siguiente,
  })

  const cambio = useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: EstadoVacante }) => cambiarEstadoVacante(id, estado),
    onSuccess: (_, { estado }) => {
      toast.success(MENSAJE_ESTADO[estado])
      void queryClient.invalidateQueries({ queryKey: CLAVE_MIS_VACANTES })
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  if (vacantes.isPending) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" role="status" aria-label="Cargando vacantes">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (vacantes.isError) {
    return (
      <p role="alert" className="text-center text-destructive">
        No pudimos cargar tus vacantes. Recarga la página para intentar de nuevo.
      </p>
    )
  }

  const lista = vacantes.data.pages.flatMap((pagina) => pagina.vacantes)

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Mis vacantes</h1>
        <Button asChild size="sm">
          <Link to={RUTAS.empresaNuevaVacante}>Publicar vacante</Link>
        </Button>
      </div>

      {lista.length === 0 ? (
        <p className="text-muted-foreground">Aún no has publicado vacantes.</p>
      ) : (
        <ul className="space-y-3">
          {lista.map((vacante) => (
            <li key={vacante.id} className="space-y-2 rounded-lg border p-4">
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{vacante.titulo}</h2>
                <VacancyStateBadge estado={vacante.estado} />
              </div>
              <p className="text-sm text-muted-foreground">
                {ETIQUETA_TIPO[vacante.tipo]} · {ETIQUETA_MODALIDAD[vacante.modalidad]} · {vacante.ciudad}
              </p>
              <p className="text-sm text-muted-foreground">Cierra el {vacante.fechaCierre}</p>
              <VacancyActions
                vacante={vacante}
                ocupado={cambio.isPending}
                onCambiarEstado={(estado) => cambio.mutate({ id: vacante.id, estado })}
              />
            </li>
          ))}
        </ul>
      )}

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