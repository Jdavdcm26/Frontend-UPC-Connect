import { CalendarClock, MapPin, Pause, Plus, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import VacancyActions from '@/features/vacantes/VacancyActions'
import VacancyStateBadge from '@/features/vacantes/VacancyStateBadge'
import VacancyTypeBadge from '@/features/vacantes/VacancyTypeBadge'
import { ETIQUETA_MODALIDAD, type EstadoVacante, type Vacante } from '@/features/vacantes/tipos'
import { cambiarEstadoVacante, listarMisVacantes } from '@/features/vacantes/vacantesApi'
import { ApiError } from '@/shared/api/apiError'
import { formatearDia } from '@/shared/lib/fechas'
import { RUTAS } from '@/shared/lib/rutas'
import AvisoInformativo from '@/shared/ui/AvisoInformativo'
import DatoIcono from '@/shared/ui/DatoIcono'
import EmptyState from '@/shared/ui/EmptyState'
import EncabezadoPagina from '@/shared/ui/EncabezadoPagina'
import ErrorState from '@/shared/ui/ErrorState'

// Franja de color a la izquierda de cada tarjeta según el estado de la vacante.
const ACENTO_ESTADO: Record<EstadoVacante, string> = {
  ACTIVA: 'border-l-primary',
  PAUSADA: 'border-l-ambar',
  CERRADA: 'border-l-slate-400',
}

const MENSAJE_ESTADO: Record<EstadoVacante, string> = {
  ACTIVA: 'Vacante reanudada.',
  PAUSADA: 'Vacante pausada.',
  CERRADA: 'Vacante cerrada.',
}

// Lista de las vacantes de la empresa con sus acciones, por cursor (FE-20).
export default function MisVacantesPage() {
  const [lista, setLista] = useState<Vacante[]>([])
  const [siguiente, setSiguiente] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [error, setError] = useState<unknown>()
  const [cambiando, setCambiando] = useState(false)
  // Cambiar este número vuelve a ejecutar el efecto (botón «Reintentar»).
  const [intento, setIntento] = useState(0)

  // Primera página al entrar.
  useEffect(() => {
    let vigente = true
    listarMisVacantes(null)
      .then((pagina) => {
        if (!vigente) return
        setLista(pagina.vacantes)
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
  }, [intento])

  function reintentar() {
    setCargando(true)
    setError(undefined)
    setIntento((n) => n + 1)
  }

  async function cargarMas() {
    if (siguiente === null) return
    setCargandoMas(true)
    try {
      const pagina = await listarMisVacantes(siguiente)
      setLista((actual) => [...actual, ...pagina.vacantes])
      setSiguiente(pagina.siguiente)
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'No pudimos cargar más vacantes. Intenta de nuevo.')
    } finally {
      setCargandoMas(false)
    }
  }

  // Al cambiar el estado se actualiza esa vacante en la lista, sin volver a pedir todas las páginas.
  async function cambiarEstado(id: string, estado: EstadoVacante) {
    setCambiando(true)
    try {
      await cambiarEstadoVacante(id, estado)
      setLista((actual) => actual.map((v) => (v.id === id ? { ...v, estado } : v)))
      toast.success(MENSAJE_ESTADO[estado])
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'No pudimos cambiar el estado. Intenta de nuevo.')
    } finally {
      setCambiando(false)
    }
  }

  if (cargando) {
    return (
      <div className="space-y-4" role="status" aria-label="Cargando vacantes">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState mensaje="No pudimos cargar tus vacantes. Intenta de nuevo en un momento." onReintentar={reintentar} />
    )
  }

  return (
    <section className="space-y-6">
      <EncabezadoPagina
        titulo="Mis vacantes"
        descripcion="Edita, pausa o cierra tus ofertas y revisa quiénes se postularon."
        acciones={
          <Button asChild>
            <Link to={RUTAS.empresaNuevaVacante}>
              <Plus aria-hidden="true" />
              Publicar vacante
            </Link>
          </Button>
        }
      />

      {lista.length === 0 ? (
        <EmptyState
          titulo="Aún no has publicado vacantes"
          descripcion="Publica tu primera vacante, práctica o pasantía para empezar a recibir postulaciones."
          accion={
            <Button asChild variant="outline">
              <Link to={RUTAS.empresaNuevaVacante}>Publicar vacante</Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-4">
          {lista.map((vacante) => (
            <li
              key={vacante.id}
              className={cn(
                'space-y-3 rounded-xl border border-l-4 bg-card p-5 shadow-sm sm:p-6',
                ACENTO_ESTADO[vacante.estado],
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <VacancyStateBadge estado={vacante.estado} />
                <VacancyTypeBadge tipo={vacante.tipo} />
              </div>
              <h2 className="break-words text-lg font-semibold">{vacante.titulo}</h2>
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                <DatoIcono icono={MapPin}>
                  {ETIQUETA_MODALIDAD[vacante.modalidad]} · {vacante.ciudad}
                </DatoIcono>
                <DatoIcono icono={CalendarClock}>Fecha de cierre: {formatearDia(vacante.fechaCierre)}</DatoIcono>
                {/* Si el servidor aún no envía el conteo (llega con BE-32), se cuenta como 0. */}
                <DatoIcono icono={Users}>{vacante.postulacionesTotal ?? 0} postulaciones</DatoIcono>
              </div>
              {vacante.estado === 'PAUSADA' && (
                <AvisoInformativo icono={Pause}>
                  Vacante en pausa: no se muestra a los candidatos hasta que la reanudes.
                </AvisoInformativo>
              )}
              <VacancyActions
                vacante={vacante}
                ocupado={cambiando}
                onCambiarEstado={(estado) => void cambiarEstado(vacante.id, estado)}
              />
            </li>
          ))}
        </ul>
      )}

      {siguiente !== null && (
        <div className="text-center">
          <Button variant="outline" disabled={cargandoMas} onClick={() => void cargarMas()}>
            {cargandoMas ? 'Cargando...' : 'Cargar más'}
          </Button>
        </div>
      )}
    </section>
  )
}