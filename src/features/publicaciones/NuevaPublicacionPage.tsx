import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import PostForm from '@/features/publicaciones/PostForm'
import { listarCategorias } from '@/features/publicaciones/publicacionesApi'
import type { Categoria } from '@/features/publicaciones/tipos'
import { RUTAS } from '@/shared/lib/rutas'
import EncabezadoPagina from '@/shared/ui/EncabezadoPagina'
import EnlaceVolver from '@/shared/ui/EnlaceVolver'
import ErrorState from '@/shared/ui/ErrorState'

// Publicar en la comunidad (HU-18 a HU-21). Solo estudiantes y egresados con perfil.
export default function NuevaPublicacionPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<unknown>()
  // Cambiar este número vuelve a pedir las categorías (botón «Reintentar»).
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let vigente = true
    listarCategorias()
      .then((datos) => {
        if (vigente) setCategorias(datos)
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
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-4">
        <EnlaceVolver to={RUTAS.publicaciones}>Volver a publicaciones</EnlaceVolver>
        <EncabezadoPagina
          titulo="Nueva publicación"
          descripcion="Comparte algo con la comunidad, ofrece un servicio o busca equipo para un proyecto."
        />
      </div>

      {cargando && (
        <div className="space-y-4" role="status" aria-label="Cargando formulario">
          <Skeleton className="h-56 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      )}

      {!cargando && error !== undefined && (
        <ErrorState mensaje="No pudimos cargar las categorías. Intenta de nuevo en un momento." onReintentar={reintentar} />
      )}

      {!cargando && error === undefined && <PostForm categorias={categorias} />}
    </section>
  )
}
