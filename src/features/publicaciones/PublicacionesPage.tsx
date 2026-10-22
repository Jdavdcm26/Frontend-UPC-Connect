import { PenSquare, UserX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useSession } from '@/features/auth/useSession'
import FeedPublicaciones from '@/features/publicaciones/FeedPublicaciones'
import { filtrosPublicacionesAUrl, filtrosPublicacionesDesdeUrl, type FiltrosPublicaciones } from '@/features/publicaciones/filtros'
import PestanasAlcance from '@/features/publicaciones/PestanasAlcance'
import PostFilters from '@/features/publicaciones/PostFilters'
import { listarCategorias } from '@/features/publicaciones/publicacionesApi'
import type { Categoria } from '@/features/publicaciones/tipos'
import { RUTAS } from '@/shared/lib/rutas'
import EncabezadoPagina from '@/shared/ui/EncabezadoPagina'
import { claseEnlace } from '@/shared/ui/estilosEnlace'

// Feed de la comunidad (HU-18, HU-24). Lo ven estudiantes, egresados y empresas; solo los primeros publican
// y reaccionan. Las pestañas y los filtros viven en la URL.
export default function PublicacionesPage() {
  const { usuario } = useSession()
  const esCandidato = usuario?.rol === 'candidato'
  const [params, setParams] = useSearchParams()
  const deLaUrl = filtrosPublicacionesDesdeUrl(params)
  // Las empresas no siguen a nadie: su alcance siempre es la comunidad.
  const filtros: FiltrosPublicaciones = esCandidato ? deLaUrl : { ...deLaUrl, alcance: 'comunidad' }
  // Los filtros se recalculan en cada render; su texto en la URL dice si de verdad cambiaron.
  const claveFiltros = params.toString()

  const [categorias, setCategorias] = useState<Categoria[]>([])
  // Cambiar este número monta de nuevo los resultados (botón «Reintentar»).
  const [intento, setIntento] = useState(0)

  // Las categorías solo alimentan el filtro: si fallan, el filtro queda con «Todas».
  useEffect(() => {
    let vigente = true
    listarCategorias()
      .then((datos) => {
        if (vigente) setCategorias(datos)
      })
      .catch(() => {})
    return () => {
      vigente = false
    }
  }, [])

  function cambiar(nuevos: FiltrosPublicaciones) {
    setParams(filtrosPublicacionesAUrl(nuevos))
  }

  const vacio =
    filtros.alcance === 'seguidos' && !filtros.tipo && !filtros.categoriaId
      ? {
          titulo: 'Aún no hay publicaciones de quienes sigues',
          descripcion: esCandidato
            ? 'Sigue a otras personas desde su perfil para ver aquí lo que publican.'
            : 'Aquí aparecen las publicaciones de las personas que sigues.',
        }
      : filtros.tipo || filtros.categoriaId
        ? { titulo: 'No encontramos publicaciones', descripcion: 'No hay publicaciones con esos filtros. Prueba con otros o pulsa «Limpiar».' }
        : {
            titulo: 'Todavía no hay publicaciones',
            descripcion: esCandidato ? 'Sé la primera persona en compartir algo con la comunidad.' : undefined,
          }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <EncabezadoPagina
        titulo="Publicaciones"
        descripcion={
          esCandidato
            ? 'Comparte ideas, ofrece servicios y encuentra equipo para tus proyectos.'
            : 'Conoce lo que comparten los estudiantes y egresados de la universidad.'
        }
        acciones={
          esCandidato && (
            <Button asChild>
              <Link to={RUTAS.nuevaPublicacion}>
                <PenSquare aria-hidden="true" />
                Publicar
              </Link>
            </Button>
          )
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Las empresas no siguen a nadie: solo ven la comunidad. */}
        {esCandidato ? <PestanasAlcance filtros={filtros} /> : <span />}
        <Link to={RUTAS.bloqueados} className={`${claseEnlace} inline-flex items-center gap-1.5 text-sm`}>
          <UserX aria-hidden="true" className="size-4" />
          Cuentas bloqueadas
        </Link>
      </div>

      <PostFilters filtros={filtros} categorias={categorias} onCambiar={cambiar} />

      <FeedPublicaciones
        key={`${claveFiltros}-${filtros.alcance}-${intento}`}
        filtros={filtros}
        puedeInteractuar={esCandidato}
        vacio={vacio}
        onReintentar={() => setIntento((n) => n + 1)}
      />
    </section>
  )
}
