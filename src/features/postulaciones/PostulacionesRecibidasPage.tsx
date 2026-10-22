import { useEffect, useRef, useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import CandidateList from '@/features/postulaciones/CandidateList'
import { idBotonVerPerfil } from '@/features/postulaciones/foco'
import CandidateProfilePanel from '@/features/postulaciones/CandidateProfilePanel'
import { listarPostulacionesRecibidas } from '@/features/postulaciones/postulacionesEmpresaApi'
import type { EstadoPostulacion, PostulacionRecibida } from '@/features/postulaciones/tipos'
import type { Vacante } from '@/features/vacantes/tipos'
import { obtenerMiVacante } from '@/features/vacantes/vacantesApi'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'
import EmptyState from '@/shared/ui/EmptyState'
import EncabezadoPagina from '@/shared/ui/EncabezadoPagina'
import EnlaceVolver from '@/shared/ui/EnlaceVolver'
import ErrorState from '@/shared/ui/ErrorState'

// 403 y 404 significan que la vacante no existe o es de otra empresa: se muestra «Sin permiso».
const esAjena = (error: unknown) => error instanceof ApiError && (error.status === 403 || error.status === 404)

// Candidatos que se postularon a una vacante de la empresa (HU-47 / FE-25).
// Con key={id}, si cambia la vacante de la URL el contenido se monta de nuevo con su estado limpio.
export default function PostulacionesRecibidasPage() {
  const { id = '' } = useParams()
  return <PostulacionesRecibidas key={id} id={id} />
}

function PostulacionesRecibidas({ id }: { id: string }) {
  // La postulación abierta en el panel vive en la URL, para que «atrás» la cierre y se pueda compartir.
  const [params, setParams] = useSearchParams()
  const seleccionada = params.get('postulacion')
  const [vacante, setVacante] = useState<Vacante>()
  const [errorVacante, setErrorVacante] = useState<unknown>()
  const [lista, setLista] = useState<PostulacionRecibida[]>([])
  const [siguiente, setSiguiente] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [error, setError] = useState<unknown>()
  // Cambiar este número vuelve a pedir la primera página (botón «Reintentar»).
  const [intento, setIntento] = useState(0)

  // Título de la vacante (y comprobación de que es de esta empresa).
  useEffect(() => {
    let vigente = true
    obtenerMiVacante(id)
      .then((datos) => {
        if (vigente) setVacante(datos)
      })
      .catch((e) => {
        if (vigente) setErrorVacante(e)
      })
    return () => {
      vigente = false
    }
  }, [id])

  // Primera página de postulaciones.
  useEffect(() => {
    let vigente = true
    listarPostulacionesRecibidas(id, null)
      .then((pagina) => {
        if (!vigente) return
        setLista(pagina.postulaciones)
        setSiguiente(pagina.siguiente)
      })
      .catch((e) => {
        if (vigente) setError(e)
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })
    return () => {
      vigente = false
    }
  }, [id, intento])

  function reintentar() {
    setCargando(true)
    setError(undefined)
    setIntento((n) => n + 1)
  }

  async function cargarMas() {
    if (siguiente === null) return
    setCargandoMas(true)
    try {
      const pagina = await listarPostulacionesRecibidas(id, siguiente)
      setLista((actual) => [...actual, ...pagina.postulaciones])
      setSiguiente(pagina.siguiente)
    } catch (e) {
      setError(e)
    } finally {
      setCargandoMas(false)
    }
  }

  // El panel avisa cuando la empresa cambia un estado: la lista lo muestra sin volver a pedirla.
  function alCambiarEstado(postulacionId: string, estado: EstadoPostulacion) {
    setLista((actual) => actual.map((p) => (p.id === postulacionId ? { ...p, estado } : p)))
  }

  // Al cerrar el panel, el foco vuelve al botón «Ver perfil» que lo abrió (si no, se pierde al desaparecer «Cerrar»).
  const devolverFocoA = useRef<string | null>(null)
  useEffect(() => {
    if (seleccionada || !devolverFocoA.current) return
    document.getElementById(idBotonVerPerfil(devolverFocoA.current))?.focus()
    devolverFocoA.current = null
  }, [seleccionada])

  if (esAjena(errorVacante) || esAjena(error)) {
    return <Navigate to={RUTAS.sinPermiso} replace />
  }

  const seleccionar = (postulacionId: string) => setParams({ postulacion: postulacionId })
  const cerrarPanel = () => {
    devolverFocoA.current = seleccionada
    setParams({})
  }

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <EnlaceVolver to={RUTAS.empresaVacantes}>Volver a mis vacantes</EnlaceVolver>
        <EncabezadoPagina titulo="Postulaciones recibidas" descripcion={vacante?.titulo} />
      </div>

      <div className={seleccionada ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-start' : undefined}>
        {/* En pantallas angostas el panel aparece arriba de la lista; en anchas, a su lado. */}
        {seleccionada && (
          <div className="lg:order-last">
            <CandidateProfilePanel
              key={seleccionada}
              postulacionId={seleccionada}
              onEstadoCambiado={alCambiarEstado}
              onCerrar={cerrarPanel}
            />
          </div>
        )}
        <div className="space-y-4">
          {cargando && (
            <div className="space-y-4" role="status" aria-label="Cargando postulaciones">
              <Skeleton className="h-28 w-full rounded-xl" />
              <Skeleton className="h-28 w-full rounded-xl" />
            </div>
          )}

          {!cargando && error !== undefined && (
            <ErrorState
              mensaje="No pudimos cargar las postulaciones. Intenta de nuevo en un momento."
              onReintentar={reintentar}
            />
          )}

          {!cargando && error === undefined && lista.length === 0 && (
            <EmptyState
              titulo="Aún no hay postulaciones"
              descripcion="Cuando un candidato se postule a esta vacante, aparecerá aquí."
            />
          )}

          {lista.length > 0 && (
            <CandidateList postulaciones={lista} seleccionadaId={seleccionada} onSeleccionar={seleccionar} />
          )}

          {!cargando && siguiente !== null && (
            <div className="text-center">
              <Button variant="outline" disabled={cargandoMas} onClick={() => void cargarMas()}>
                {cargandoMas ? 'Cargando...' : 'Cargar más'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}