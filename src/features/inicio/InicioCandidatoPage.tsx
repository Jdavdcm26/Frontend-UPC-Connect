import { BadgeCheck, BriefcaseBusiness, ClipboardList, Newspaper, Search, UserRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/features/auth/useSession'
import DashboardCard from '@/features/inicio/DashboardCard'
import QuickActions, { type Acceso } from '@/features/inicio/QuickActions'
import RecentApplications from '@/features/inicio/RecentApplications'
import Saludo from '@/features/inicio/Saludo'
import { resumenAcademico } from '@/features/perfil/formato'
import { obtenerPerfil } from '@/features/perfil/perfilApi'
import type { Perfil } from '@/features/perfil/tipos'
import { useConteoPublicaciones } from '@/features/publicaciones/useConteoPublicaciones'
import { listarMisPostulaciones } from '@/features/postulaciones/postulacionesApi'
import type { Postulacion } from '@/features/postulaciones/tipos'
import { FILTROS_VACIOS } from '@/features/vacantes/filtros'
import type { Vacante } from '@/features/vacantes/tipos'
import VacancyCard from '@/features/vacantes/VacancyCard'
import { listarVacantes } from '@/features/vacantes/vacantesApi'
import { RUTAS } from '@/shared/lib/rutas'
import EmptyState from '@/shared/ui/EmptyState'
import ErrorState from '@/shared/ui/ErrorState'
import TarjetaEstadistica from '@/shared/ui/TarjetaEstadistica'

const CANTIDAD_RECIENTES = 3
const MAX_PAGINAS = 20

const ACCESOS: Acceso[] = [
  { ruta: RUTAS.vacantes, titulo: 'Vacantes', descripcion: 'Busca y filtra ofertas para tu carrera.', icono: Search },
  { ruta: RUTAS.misPostulaciones, titulo: 'Mis postulaciones', descripcion: 'Sigue el estado de cada una.', icono: ClipboardList },
  { ruta: RUTAS.perfil, titulo: 'Mi perfil', descripcion: 'Revisa y actualiza tus datos.', icono: UserRound },
]

// Inicio del candidato (HU-03 / FE-28): accesos, cifras reales y actividad reciente.
export default function InicioCandidatoPage() {
  const { usuario } = useSession()
  const publicaciones = useConteoPublicaciones(usuario?.id)
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([])
  const [vacantes, setVacantes] = useState<Vacante[]>([])
  const [cargando, setCargando] = useState(true)
  const [cargandoVacantes, setCargandoVacantes] = useState(true)
  const [error, setError] = useState<unknown>()
  const [errorVacantes, setErrorVacantes] = useState<unknown>()
  // Cambiar este número vuelve a ejecutar los efectos (botón «Reintentar»).
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

  // Se recorre la paginación existente para obtener cifras reales y, de paso, las más recientes.
  useEffect(() => {
    let vigente = true
    async function cargar() {
      setCargando(true)
      setError(undefined)
      const todas: Postulacion[] = []
      let cursor: string | null = null
      let paginas = 0
      do {
        const pagina = await listarMisPostulaciones(cursor)
        todas.push(...pagina.postulaciones)
        cursor = pagina.siguiente
        paginas += 1
      } while (cursor !== null && paginas < MAX_PAGINAS)
      if (vigente) setPostulaciones(todas)
    }
    cargar()
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

  useEffect(() => {
    let vigente = true
    async function cargar() {
      setCargandoVacantes(true)
      setErrorVacantes(undefined)
      const todas: Vacante[] = []
      let cursor: string | null = null
      let paginas = 0
      do {
        const pagina = await listarVacantes(FILTROS_VACIOS, cursor)
        todas.push(...pagina.vacantes)
        cursor = pagina.siguiente
        paginas += 1
      } while (cursor !== null && paginas < MAX_PAGINAS)
      if (vigente) setVacantes(todas)
    }
    cargar()
      .catch((e) => {
        // Si falla, se ocultan la cifra y las recomendaciones sin afectar al resto del panel.
        if (vigente) setErrorVacantes(e)
      })
      .finally(() => {
        if (vigente) setCargandoVacantes(false)
      })
    return () => {
      vigente = false
    }
  }, [intento])

  function reintentar() {
    setIntento((n) => n + 1)
  }

  const recientes = postulaciones.slice(0, CANTIDAD_RECIENTES)
  const seleccionadas = postulaciones.filter((p) => p.estado === 'SELECCIONADO').length
  const hayPostulaciones = !cargando && error === undefined

  return (
    <div className="space-y-7">
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

      <section aria-label="Tus cifras" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TarjetaEstadistica
          titulo="Vacantes disponibles"
          valor={errorVacantes !== undefined ? null : vacantes.length}
          icono={BriefcaseBusiness}
          tono="verde"
          detalle="Ofertas activas para tu perfil"
          ruta={RUTAS.vacantes}
          cargando={cargandoVacantes}
        />
        <TarjetaEstadistica
          titulo="Postulaciones realizadas"
          valor={error !== undefined ? null : postulaciones.length}
          icono={ClipboardList}
          tono="esmeralda"
          detalle="Todas las que has enviado"
          ruta={RUTAS.misPostulaciones}
          cargando={cargando}
        />
        <TarjetaEstadistica
          titulo="Postulaciones seleccionadas"
          valor={error !== undefined ? null : seleccionadas}
          icono={BadgeCheck}
          tono="ambar"
          detalle="Etapa de selección superada"
          cargando={cargando}
        />
        {!publicaciones.cargando && publicaciones.total !== null && (
          <TarjetaEstadistica
            titulo="Publicaciones realizadas"
            valor={publicaciones.total}
            icono={Newspaper}
            tono="indigo"
            detalle="Lo que has compartido"
            ruta={RUTAS.publicaciones}
          />
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardCard
          titulo="Postulaciones recientes"
          icono={ClipboardList}
          enlace={{ ruta: RUTAS.misPostulaciones, etiqueta: 'Ver todas' }}
        >
          {cargando && (
            <div className="space-y-3" role="status" aria-label="Cargando postulaciones">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          )}

          {!cargando && error !== undefined && (
            <ErrorState
              mensaje="No pudimos cargar tus postulaciones. Intenta de nuevo en un momento."
              onReintentar={reintentar}
            />
          )}

          {hayPostulaciones && recientes.length === 0 && (
            <EmptyState
              titulo="Aún no te has postulado"
              descripcion="Explora las vacantes y postúlate a la que más te interese."
              accion={
                <Button asChild>
                  <Link to={RUTAS.vacantes}>Ver vacantes</Link>
                </Button>
              }
            />
          )}

          {recientes.length > 0 && <RecentApplications postulaciones={recientes} />}
        </DashboardCard>

        <DashboardCard
          titulo="Vacantes para ti"
          icono={Search}
          enlace={{ ruta: RUTAS.vacantes, etiqueta: 'Explorar' }}
        >
          {cargandoVacantes && (
            <div className="space-y-3" role="status" aria-label="Cargando vacantes">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          )}
          {!cargandoVacantes && errorVacantes !== undefined && (
            <ErrorState
              mensaje="No pudimos cargar las vacantes recomendadas."
              onReintentar={reintentar}
            />
          )}
          {!cargandoVacantes && errorVacantes === undefined && vacantes.slice(0, CANTIDAD_RECIENTES).length === 0 && (
            <EmptyState
              titulo="No hay vacantes por ahora"
              descripcion="Cuando se publiquen nuevas oportunidades, aparecerán aquí."
            />
          )}
          {!cargandoVacantes && vacantes.length > 0 && (
            <ul className="space-y-2.5">
              {vacantes.slice(0, CANTIDAD_RECIENTES).map((vacante) => (
                <li key={vacante.id} className="entrar">
                  <VacancyCard vacante={vacante} compact />
                </li>
              ))}
            </ul>
          )}
        </DashboardCard>
      </div>
    </div>
  )
}
