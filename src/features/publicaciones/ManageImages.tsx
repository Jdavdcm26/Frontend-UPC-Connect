import { useState } from 'react'
import { toast } from 'sonner'
import ImagePicker from '@/features/publicaciones/ImagePicker'
import { filtrarImagenes } from '@/features/publicaciones/imagenes'
import { LIMITES_PUBLICACION } from '@/features/publicaciones/limites'
import { agregarImagenes, quitarImagen } from '@/features/publicaciones/publicacionesApi'
import type { Publicacion } from '@/features/publicaciones/tipos'
import { ApiError } from '@/shared/api/apiError'
import { mensajeDeError } from '@/shared/lib/erroresServidor'
import SeccionFormulario from '@/shared/ui/SeccionFormulario'

type Props = {
  publicacion: Publicacion
  // El servidor devuelve la publicación actualizada después de cada cambio.
  onCambio: (publicacion: Publicacion) => void
}

// Imágenes de una publicación existente (HU-21). Cada cambio se guarda al momento, aparte del formulario.
export default function ManageImages({ publicacion, onCambio }: Props) {
  const [ocupado, setOcupado] = useState(false)
  const [errores, setErrores] = useState<string[]>([])
  const actuales = publicacion.imagenes.length

  async function elegir(archivos: File[]) {
    const { aceptadas, problemas } = filtrarImagenes(archivos, actuales)
    setErrores(problemas)
    if (aceptadas.length === 0) return
    setOcupado(true)
    try {
      onCambio(await agregarImagenes(publicacion.id, aceptadas))
      toast.success(aceptadas.length === 1 ? 'Imagen agregada.' : 'Imágenes agregadas.')
    } catch (error) {
      setErrores(
        error instanceof ApiError && error.campos.imagenes
          ? error.campos.imagenes
          : [mensajeDeError(error, 'No pudimos subir las imágenes. Intenta de nuevo.')],
      )
    } finally {
      setOcupado(false)
    }
  }

  async function quitar(imagenId: string) {
    setErrores([])
    setOcupado(true)
    try {
      onCambio(await quitarImagen(publicacion.id, imagenId))
      toast.success('Imagen quitada.')
    } catch (error) {
      toast.error(mensajeDeError(error, 'No pudimos quitar la imagen. Intenta de nuevo.'))
    } finally {
      setOcupado(false)
    }
  }

  return (
    <SeccionFormulario
      numero={3}
      titulo="Imágenes"
      descripcion="Los cambios en las imágenes se guardan al momento, sin pulsar «Guardar cambios»."
    >
      <ImagePicker
        id="imagenes"
        vistas={publicacion.imagenes.map((imagen, i) => ({ id: imagen.id, url: imagen.url, nombre: `imagen guardada ${i + 1}` }))}
        restantes={LIMITES_PUBLICACION.imagenes - actuales}
        onElegir={(archivos) => void elegir(archivos)}
        onQuitar={(id) => void quitar(id)}
        ocupado={ocupado}
        errores={errores}
      />
      {ocupado && (
        <p role="status" className="text-sm text-muted-foreground">
          Guardando imágenes...
        </p>
      )}
    </SeccionFormulario>
  )
}
