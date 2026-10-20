import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import CandidateList from '@/features/postulaciones/CandidateList'
import { idBotonVerPerfil } from '@/features/postulaciones/foco'
import CandidateProfilePanel from '@/features/postulaciones/CandidateProfilePanel'
import { claveRecibidas, listarPostulacionesRecibidas } from '@/features/postulaciones/postulacionesEmpresaApi'
import { claveMiVacante, obtenerMiVacante } from '@/features/vacantes/vacantesApi'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'
import EmptyState from '@/shared/ui/EmptyState'
import ErrorState from '@/shared/ui/ErrorState'

// 403 y 404 significan que la vacante no existe o es de otra empresa: se muestra «Sin permiso».
const esAjena = (error: unknown) => error instanceof ApiError && (error.status === 403 || error.status === 404)

// Candidatos que se postularon a una vacante de la empresa (HU-47 / FE-25).
export default function PostulacionesRecibidasPage() {
  const { id = '' } = useParams()
  // La postulación abierta en el panel vive en la URL, para que «atrás» la cierre y se pueda compartir.
  const [params, setParams] = useSearchParams()
  const seleccionada = params.get('postulacion')
  const vacante = useQuery({ queryKey: claveMiVacante(id), queryFn: () => obtenerMiVacante(id) })
  const postulaciones = useInfiniteQuery({
    queryKey: claveRecibidas(id),
    queryFn: ({ pageParam }) => listarPostulacionesRecibidas(id, pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (ultima) => ultima.siguiente,
  })

  // Al cerrar el panel, el foco vuelve al botón «Ver perfil» que lo abrió (si no, se pierde al desaparecer «Cerrar»).
  const devolverFocoA = useRef<string | null>(null)
  useEffect(() => {
    if (seleccionada || !devolverFocoA.current) return
    document.getElementById(idBotonVerPerfil(devolverFocoA.current))?.focus()
    devolverFocoA.current = null
  }, [seleccionada])

  if (esAjena(vacante.error) || esAjena(postulaciones.error)) {
    return <Navigate to={RUTAS.sinPermiso} replace />
  }

  const lista = postulaciones.data?.pages.flatMap((pagina) => pagina.postulaciones) ?? []

  const seleccionar = (postulacionId: string) => setParams({ postulacion: postulacionId })
  const cerrarPanel = () => {
    devolverFocoA.current = seleccionada
    setParams({})
  }

  return (
    <section className="mx-auto max-w-5xl space-y-4">
      <Link to={RUTAS.empresaVacantes} className="text-sm underline">
        ← Volver a mis vacantes
      </Link>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Postulaciones recibidas</h1>
        {vacante.isSuccess && <p className="text-muted-foreground">{vacante.data.titulo}</p>}
      </div>

      <div className={seleccionada ? 'grid gap-4 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start' : 'mx-auto max-w-3xl'}>
        {/* En pantallas angostas el panel aparece arriba de la lista; en anchas, a su lado. */}
        {seleccionada && (
          <div className="lg:order-last">
            <CandidateProfilePanel
              key={seleccionada}
              postulacionId={seleccionada}
              vacanteId={id}
              onCerrar={cerrarPanel}
            />
          </div>
        )}
        <div className="space-y-4">
          {postulaciones.isPending && (
            <div className="space-y-3" role="status" aria-label="Cargando postulaciones">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}

          {postulaciones.isError && (
            <ErrorState
              mensaje="No pudimos cargar las postulaciones. Intenta de nuevo en un momento."
              onReintentar={() => void postulaciones.refetch()}
            />
          )}

          {postulaciones.isSuccess && lista.length === 0 && (
            <EmptyState
              titulo="Aún no hay postulaciones"
              descripcion="Cuando un candidato se postule a esta vacante, aparecerá aquí."
            />
          )}

          {lista.length > 0 && (
            <CandidateList postulaciones={lista} seleccionadaId={seleccionada} onSeleccionar={seleccionar} />
          )}

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
        </div>
      </div>
    </section>
  )
}