import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import ApplicationList from '@/features/postulaciones/ApplicationList'
import { listarMisPostulaciones } from '@/features/postulaciones/postulacionesApi'
import type { Postulacion } from '@/features/postulaciones/tipos'
import { RUTAS } from '@/shared/lib/rutas'
import EmptyState from '@/shared/ui/EmptyState'
import ErrorState from '@/shared/ui/ErrorState'

// Historial de postulaciones de la persona con sesión (HU-46 / FE-24).
// Se actualiza al entrar a la pantalla o al recargar, porque en el Release 1 no hay tiempo real.
export default function MisPostulacionesPage() {
  const [lista, setLista] = useState<Postulacion[]>([])
  const [siguiente, setSiguiente] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [error, setError] = useState<unknown>()
  // Cambiar este número vuelve a ejecutar el efecto (botón «Reintentar»).
  const [intento, setIntento] = useState(0)

  // Primera página.
  useEffect(() => {
    let vigente = true
    listarMisPostulaciones(null)
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
      const pagina = await listarMisPostulaciones(siguiente)
      setLista((actual) => [...actual, ...pagina.postulaciones])
      setSiguiente(pagina.siguiente)
    } catch (e) {
      setError(e)
    } finally {
      setCargandoMas(false)
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">Mis postulaciones</h1>

      {cargando && (
        <div className="space-y-3" role="status" aria-label="Cargando postulaciones">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {!cargando && error !== undefined && (
        <ErrorState
          mensaje="No pudimos cargar tus postulaciones. Intenta de nuevo en un momento."
          onReintentar={reintentar}
        />
      )}

      {!cargando && error === undefined && lista.length === 0 && (
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

      {!cargando && siguiente !== null && (
        <div className="text-center">
          <Button variant="outline" disabled={cargandoMas} onClick={() => void cargarMas()}>
            {cargandoMas ? 'Cargando...' : 'Cargar más'}
          </Button>
        </div>
      )}
    </section>
  )
}
