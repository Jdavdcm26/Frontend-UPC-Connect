import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/features/auth/useSession'
import ApprovalBanner from '@/features/inicio/ApprovalBanner'
import DashboardCard from '@/features/inicio/DashboardCard'
import QuickActions, { type Acceso } from '@/features/inicio/QuickActions'
import VacancySummaryTable from '@/features/inicio/VacancySummaryTable'
import type { Vacante } from '@/features/vacantes/tipos'
import { listarMisVacantes } from '@/features/vacantes/vacantesApi'
import { RUTAS } from '@/shared/lib/rutas'
import EmptyState from '@/shared/ui/EmptyState'
import ErrorState from '@/shared/ui/ErrorState'

const ACCESOS: Acceso[] = [
  { ruta: RUTAS.empresaNuevaVacante, titulo: 'Publicar vacante', descripcion: 'Crea una nueva oferta.' },
  { ruta: RUTAS.empresaVacantes, titulo: 'Mis vacantes', descripcion: 'Edita, pausa o cierra tus ofertas.' },
]

// Inicio de la empresa (HU-03 / FE-29): vacantes con su conteo de postulaciones y accesos.
export default function InicioEmpresaPage() {
  const { usuario } = useSession()
  const [lista, setLista] = useState<Vacante[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<unknown>()
  // Cambiar este número vuelve a ejecutar el efecto (botón «Reintentar»).
  const [intento, setIntento] = useState(0)

  // Se pide al entrar al inicio, así que siempre muestra lo último publicado.
  useEffect(() => {
    let vigente = true
    listarMisVacantes(null)
      .then((pagina) => {
        if (vigente) setLista(pagina.vacantes)
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

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Inicio</h1>

      {/* Solo cuando el servidor dice expresamente que no está aprobada. */}
      {usuario?.empresaAprobada === false && <ApprovalBanner />}

      <QuickActions accesos={ACCESOS} />

      <DashboardCard titulo="Mis vacantes" enlace={{ ruta: RUTAS.empresaVacantes, etiqueta: 'Ver todas' }}>
        {cargando && (
          <div className="space-y-3" role="status" aria-label="Cargando vacantes">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {!cargando && error !== undefined && (
          <ErrorState
            mensaje="No pudimos cargar tus vacantes. Intenta de nuevo en un momento."
            onReintentar={reintentar}
          />
        )}

        {!cargando && error === undefined && lista.length === 0 && (
          <EmptyState
            titulo="Aún no has publicado vacantes"
            descripcion="Publica tu primera vacante para empezar a recibir postulaciones."
            accion={
              <Button asChild variant="outline">
                <Link to={RUTAS.empresaNuevaVacante}>Publicar vacante</Link>
              </Button>
            }
          />
        )}

        {lista.length > 0 && <VacancySummaryTable vacantes={lista} />}
      </DashboardCard>
    </div>
  )
}
