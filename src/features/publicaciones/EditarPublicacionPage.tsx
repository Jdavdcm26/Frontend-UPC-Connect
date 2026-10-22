import { EyeOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Skeleton } from '@/components/ui/skeleton'
import ManageImages from '@/features/publicaciones/ManageImages'
import PostForm from '@/features/publicaciones/PostForm'
import { listarCategorias, obtenerPublicacion } from '@/features/publicaciones/publicacionesApi'
import type { Categoria, Publicacion } from '@/features/publicaciones/tipos'
import { ApiError } from '@/shared/api/apiError'
import { rutaPublicacion } from '@/shared/lib/rutas'
import AvisoInformativo from '@/shared/ui/AvisoInformativo'
import EncabezadoPagina from '@/shared/ui/EncabezadoPagina'
import EnlaceVolver from '@/shared/ui/EnlaceVolver'
import ErrorState from '@/shared/ui/ErrorState'

// Editar una publicación propia (HU-22). Con key={id}, al cambiar de publicación el estado empieza limpio.
export default function EditarPublicacionPage() {
  const { id = '' } = useParams()
  return <EditarPublicacionContenido key={id} id={id} />
}

function EditarPublicacionContenido({ id }: { id: string }) {
  const [publicacion, setPublicacion] = useState<Publicacion>()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<unknown>()

  // La publicación y las categorías se piden a la vez; el formulario necesita las dos.
  useEffect(() => {
    let vigente = true
    Promise.all([obtenerPublicacion(id), listarCategorias()])
      .then(([datosPublicacion, datosCategorias]) => {
        if (!vigente) return
        setPublicacion(datosPublicacion)
        setCategorias(datosCategorias)
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
  }, [id])

  const volver = <EnlaceVolver to={rutaPublicacion(id)}>Volver a la publicación</EnlaceVolver>

  if (cargando) {
    return (
      <div className="mx-auto max-w-3xl space-y-4" role="status" aria-label="Cargando formulario">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-56 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  if (error || !publicacion) {
    const noExiste = error instanceof ApiError && error.status === 404
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {volver}
        <ErrorState
          mensaje={
            noExiste
              ? 'Esta publicación no existe o ya no está disponible.'
              : 'No pudimos cargar la publicación. Recarga la página para intentar de nuevo.'
          }
        />
      </div>
    )
  }

  // El servidor solo deja editar al autor y mientras la publicación siga visible.
  if (!publicacion.esMia || publicacion.oculta) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        {volver}
        <AvisoInformativo icono={EyeOff}>
          {publicacion.esMia
            ? 'Esta publicación fue ocultada por moderación y ya no se puede editar. Aún puedes eliminarla.'
            : 'Solo quien escribió la publicación puede editarla.'}
        </AvisoInformativo>
      </div>
    )
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-4">
        {volver}
        <EncabezadoPagina titulo="Editar publicación" descripcion="Cambia el texto, la categoría, los datos o las imágenes." />
      </div>
      <PostForm
        key={publicacion.id}
        categorias={categorias}
        publicacion={publicacion}
        seccionImagenes={<ManageImages publicacion={publicacion} onCambio={setPublicacion} />}
      />
    </section>
  )
}
