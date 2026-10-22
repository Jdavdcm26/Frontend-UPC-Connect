import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { obtenerCarreras } from '@/features/perfil/perfilApi'
import type { Carrera } from '@/features/perfil/tipos'
import { filtrosAUrl, filtrosDesdeUrl, type FiltrosVacantes } from '@/features/vacantes/filtros'
import type { Vacante } from '@/features/vacantes/tipos'
import VacancyFilters from '@/features/vacantes/VacancyFilters'
import VacancyList from '@/features/vacantes/VacancyList'
import { listarVacantes } from '@/features/vacantes/vacantesApi'

// Listado de vacantes para el candidato. Los filtros viven en la URL (FE-21).
export default function VacantesPage() {
  const [params, setParams] = useSearchParams()
  const filtros = filtrosDesdeUrl(params)
  // Los filtros se recalculan en cada render; su texto en la URL dice si de verdad cambiaron.
  const claveFiltros = params.toString()

  const [carreras, setCarreras] = useState<Carrera[]>([])

  // Las carreras solo alimentan el filtro: si fallan, el filtro queda vacío.
  useEffect(() => {
    let vigente = true
    obtenerCarreras()
      .then((datos) => {
        if (vigente) setCarreras(datos)
      })
      .catch(() => {})
    return () => {
      vigente = false
    }
  }, [])

  function aplicar(nuevos: FiltrosVacantes) {
    setParams(filtrosAUrl(nuevos))
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">Vacantes</h1>

      {/* La clave vuelve a cargar los filtros cuando cambia la URL (por ejemplo, con «atrás»). */}
      <VacancyFilters key={`filtros-${claveFiltros}`} filtros={filtros} carreras={carreras} onAplicar={aplicar} />

      {/* Con otros filtros, los resultados se montan de nuevo y empiezan desde la primera página. */}
      <ResultadosVacantes key={`resultados-${claveFiltros}`} filtros={filtros} />
    </section>
  )
}

function ResultadosVacantes({ filtros }: { filtros: FiltrosVacantes }) {
  const [lista, setLista] = useState<Vacante[]>([])
  const [siguiente, setSiguiente] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [error, setError] = useState<unknown>()

  // Primera página. Los filtros no cambian mientras este componente vive (el padre le pone key).
  useEffect(() => {
    let vigente = true
    listarVacantes(filtros, null)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar: el padre le pone key con los filtros.
  }, [])

  async function cargarMas() {
    if (siguiente === null) return
    setCargandoMas(true)
    try {
      const pagina = await listarVacantes(filtros, siguiente)
      setLista((actual) => [...actual, ...pagina.vacantes])
      setSiguiente(pagina.siguiente)
    } catch (e) {
      setError(e)
    } finally {
      setCargandoMas(false)
    }
  }

  return (
    <>
      {cargando && (
        <div className="space-y-3" role="status" aria-label="Cargando vacantes">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {!cargando && error !== undefined && (
        <p role="alert" className="text-center text-destructive">
          No pudimos cargar las vacantes. Intenta de nuevo en un momento.
        </p>
      )}

      {!cargando && error === undefined && lista.length === 0 && (
        <p className="text-muted-foreground">No encontramos vacantes con esos filtros.</p>
      )}

      {lista.length > 0 && <VacancyList vacantes={lista} />}

      {!cargando && siguiente !== null && (
        <div className="text-center">
          <Button variant="outline" disabled={cargandoMas} onClick={() => void cargarMas()}>
            {cargandoMas ? 'Cargando...' : 'Cargar más'}
          </Button>
        </div>
      )}
    </>
  )
}
