import { ClipboardList, Search, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import DashboardCard from '@/features/inicio/DashboardCard'
import QuickActions, { type Acceso } from '@/features/inicio/QuickActions'
import RecentApplications from '@/features/inicio/RecentApplications'
import Saludo from '@/features/inicio/Saludo'
import { resumenAcademico } from '@/features/perfil/formato'
import { obtenerPerfil } from '@/features/perfil/perfilApi'
import type { Perfil } from '@/features/perfil/tipos'
import { listarMisPostulaciones } from '@/features/postulaciones/postulacionesApi'
import type { Postulacion } from '@/features/postulaciones/tipos'
import { RUTAS } from '@/shared/lib/rutas'
import EmptyState from '@/shared/ui/EmptyState'
import ErrorState from '@/shared/ui/ErrorState'

// Cuántas postulaciones se muestran en el inicio.
const CANTIDAD_RECIENTES = 3

const ACCESOS: Acceso[] = [
  { ruta: RUTAS.vacantes, titulo: 'Vacantes', descripcion: 'Busca y filtra ofertas para tu carrera.', icono: Search },
  { ruta: RUTAS.misPostulaciones, titulo: 'Mis postulaciones', descripcion: 'Sigue el estado de cada una.', icono: ClipboardList },
  { ruta: RUTAS.perfil, titulo: 'Mi perfil', descripcion: 'Revisa y actualiza tus datos.', icono: UserRound },
]

// Inicio del candidato (HU-03 / FE-28): accesos y postulaciones recientes.
export default function InicioCandidatoPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [recientes, setRecientes] = useState<Postulacion[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<unknown>()
  // Cambiar este número vuelve a ejecutar el efecto de las postulaciones (botón «Reintentar»).
  const [intento, setIntento] = useState(0)

  // El perfil solo se usa para el saludo: si falla, se muestra «Inicio».
  useEffect(() => {
    let vigente = true
    obtenerPerfil()
      .then((datos) => {
        if (vigente) setPerfil(datos)
      })
      .catch(() => {})
    return () => {
      vigente = false
    }
  }, [])

  useEffect(() => {
    let vigente = true
    listarMisPostulaciones(null)
      .then((pagina) => {
        if (vigente) setRecientes(pagina.postulaciones.slice(0, CANTIDAD_RECIENTES))
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
    <div className="space-y-6">
      <Saludo
        titulo={perfil ? `Hola, ${perfil.nombres}` : 'Inicio'}
        detalle={
          perfil
            ? resumenAcademico({ carrera: perfil.carreraNombre, semestre: perfil.semestre, anioGrado: perfil.anioGrado })
            : undefined
        }
      >
        Explora las vacantes, postúlate y sigue el estado de cada postulación.
      </Saludo>

      <QuickActions accesos={ACCESOS} />

      <DashboardCard titulo="Postulaciones recientes" enlace={{ ruta: RUTAS.misPostulaciones, etiqueta: 'Ver todas' }}>
        {cargando && (
          <div className="space-y-3" role="status" aria-label="Cargando postulaciones">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        )}

        {!cargando && error !== undefined && (
          <ErrorState
            mensaje="No pudimos cargar tus postulaciones. Intenta de nuevo en un momento."
            onReintentar={reintentar}
          />
        )}

        {!cargando && error === undefined && recientes.length === 0 && (
          <EmptyState
            titulo="Aún no te has postulado"
            descripcion="Explora las vacantes y postúlate a la que más te interese."
            accion={
              <Button asChild variant="outline">
                <Link to={RUTAS.vacantes}>Ver vacantes</Link>
              </Button>
            }
          />
        )}

        {recientes.length > 0 && <RecentApplications postulaciones={recientes} />}
      </DashboardCard>
    </div>
  )
}
