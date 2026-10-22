import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import VacancyActions from '@/features/vacantes/VacancyActions'
import VacancyStateBadge from '@/features/vacantes/VacancyStateBadge'
import { ETIQUETA_MODALIDAD, ETIQUETA_TIPO, type EstadoVacante, type Vacante } from '@/features/vacantes/tipos'
import { cambiarEstadoVacante, listarMisVacantes } from '@/features/vacantes/vacantesApi'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'

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
  }, [])

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
      <div className="mx-auto max-w-3xl space-y-4" role="status" aria-label="Cargando vacantes">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <p role="alert" className="text-center text-destructive">
        No pudimos cargar tus vacantes. Recarga la página para intentar de nuevo.
      </p>
    )
  }

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