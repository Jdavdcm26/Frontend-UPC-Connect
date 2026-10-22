import {
  comentarioDesdeServidor,
  cuerpoEditarPublicacion,
  cuerpoNuevaPublicacion,
  formularioNuevaPublicacion,
  publicacionDesdeServidor,
  traducirCamposPublicacion,
  type ComentarioServidor,
  type PublicacionServidor,
} from '@/features/publicaciones/conversiones'
import type { FiltrosPublicaciones } from '@/features/publicaciones/filtros'
import type { PublicacionDatos } from '@/features/publicaciones/publicacionEsquema'
import type { Categoria, Comentario, EstadoReaccion, Publicacion } from '@/features/publicaciones/tipos'
import { ApiError } from '@/shared/api/apiError'
import { api } from '@/shared/api/client'

// Estas pantallas llegan con el Release 2, cuando el backend ya existe: no tienen datos de prueba (fixtures).

export type PaginaPublicaciones = {
  publicaciones: Publicacion[]
  // Cursor de la página siguiente; null si no hay más.
  siguiente: string | null
}

export type PaginaComentarios = {
  comentarios: Comentario[]
  siguiente: string | null
}

type Pagina<T> = { data: T[]; meta: { next_cursor: string | null } }

const ruta = (id: string) => `/api/v1/publicaciones/${encodeURIComponent(id)}`

// Errores al guardar: 403 con el motivo del servidor y 422 con los campos con los nombres del formulario.
function relanzarError(error: unknown): never {
  if (error instanceof ApiError) {
    if (error.status === 403) {
      throw new ApiError(403, error.mensajeServidor ?? error.message)
    }
    if (error.status === 422) {
      throw new ApiError(422, error.message, traducirCamposPublicacion(error.campos))
    }
  }
  throw error
}

// Categorías activas para publicar y filtrar, ordenadas por nombre.
export async function listarCategorias(): Promise<Categoria[]> {
  const respuesta = await api.get<{ data: Categoria[] }>('/api/v1/categorias')
  return respuesta.data.map((c) => ({ id: c.id, nombre: c.nombre }))
}

// Feed de la comunidad, las más recientes primero, de a 15 por cursor (HU-18, HU-24).
// Con autorId trae solo las de esa persona (su perfil).
export async function listarPublicaciones(
  filtros: FiltrosPublicaciones,
  cursor: string | null,
  autorId?: string,
): Promise<PaginaPublicaciones> {
  const params = new URLSearchParams()
  if (filtros.alcance === 'seguidos') params.set('alcance', 'seguidos')
  if (filtros.tipo) params.set('tipo', filtros.tipo)
  if (filtros.categoriaId) params.set('categoria_id', filtros.categoriaId)
  if (autorId) params.set('autor_id', autorId)
  if (cursor) params.set('cursor', cursor)
  const consulta = params.toString()
  const respuesta = await api.get<Pagina<PublicacionServidor>>(`/api/v1/publicaciones${consulta ? `?${consulta}` : ''}`)
  return {
    publicaciones: respuesta.data.map(publicacionDesdeServidor),
    siguiente: respuesta.meta.next_cursor,
  }
}

// Detalle. Una publicación oculta, de alguien bloqueado o de otra universidad responde 404.
export async function obtenerPublicacion(id: string): Promise<Publicacion> {
  const respuesta = await api.get<{ data: PublicacionServidor }>(ruta(id))
  return publicacionDesdeServidor(respuesta.data)
}

// Publica (HU-18 a HU-21). Con imágenes viaja como multipart; sin ellas, como JSON.
export async function crearPublicacion(datos: PublicacionDatos, imagenes: File[]): Promise<Publicacion> {
  try {
    const respuesta =
      imagenes.length > 0
        ? await api.postFormulario<{ data: PublicacionServidor }>('/api/v1/publicaciones', formularioNuevaPublicacion(datos, imagenes))
        : await api.post<{ data: PublicacionServidor }>('/api/v1/publicaciones', cuerpoNuevaPublicacion(datos))
    return publicacionDesdeServidor(respuesta.data)
  } catch (error) {
    relanzarError(error)
  }
}

// Edita el texto, la categoría y la plantilla; el tipo no cambia (HU-22).
export async function actualizarPublicacion(id: string, datos: PublicacionDatos): Promise<Publicacion> {
  try {
    const respuesta = await api.put<{ data: PublicacionServidor }>(ruta(id), cuerpoEditarPublicacion(datos))
    return publicacionDesdeServidor(respuesta.data)
  } catch (error) {
    relanzarError(error)
  }
}

// Borra la publicación junto con sus comentarios (HU-23).
export async function eliminarPublicacion(id: string): Promise<void> {
  await api.delete(ruta(id))
}

// Cierra o reabre un servicio o una búsqueda de equipo (HU-20).
export async function cambiarApertura(id: string, abierta: boolean): Promise<Publicacion> {
  const respuesta = await api.patch<{ data: PublicacionServidor }>(`${ruta(id)}/apertura`, { abierta })
  return publicacionDesdeServidor(respuesta.data)
}

// Agrega imágenes a una publicación propia (HU-21). Devuelve la publicación actualizada.
export async function agregarImagenes(id: string, imagenes: File[]): Promise<Publicacion> {
  const formulario = new FormData()
  for (const imagen of imagenes) formulario.append('imagenes[]', imagen)
  try {
    const respuesta = await api.postFormulario<{ data: PublicacionServidor }>(`${ruta(id)}/imagenes`, formulario)
    return publicacionDesdeServidor(respuesta.data)
  } catch (error) {
    relanzarError(error)
  }
}

// Quita una imagen de una publicación propia. Devuelve la publicación actualizada.
export async function quitarImagen(id: string, imagenId: string): Promise<Publicacion> {
  const respuesta = await api.delete<{ data: PublicacionServidor }>(`${ruta(id)}/imagenes/${encodeURIComponent(imagenId)}`)
  return publicacionDesdeServidor(respuesta.data)
}

// Reacciona o quita la reacción (HU-25). Repetir no es un error; el servidor devuelve el total.
export async function reaccionar(id: string, reaccionar: boolean): Promise<EstadoReaccion> {
  const respuesta = reaccionar
    ? await api.post<{ data: EstadoReaccion }>(`${ruta(id)}/reaccion`)
    : await api.delete<{ data: EstadoReaccion }>(`${ruta(id)}/reaccion`)
  return respuesta.data
}

// Comentarios en orden de conversación (los más antiguos primero), de a 20 por cursor (HU-26).
export async function listarComentarios(publicacionId: string, cursor: string | null): Promise<PaginaComentarios> {
  const consulta = cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''
  const respuesta = await api.get<Pagina<ComentarioServidor>>(`${ruta(publicacionId)}/comentarios${consulta}`)
  return {
    comentarios: respuesta.data.map(comentarioDesdeServidor),
    siguiente: respuesta.meta.next_cursor,
  }
}

export async function comentar(publicacionId: string, contenido: string): Promise<Comentario> {
  try {
    const respuesta = await api.post<{ data: ComentarioServidor }>(`${ruta(publicacionId)}/comentarios`, { contenido })
    return comentarioDesdeServidor(respuesta.data)
  } catch (error) {
    relanzarError(error)
  }
}

export async function editarComentario(id: string, contenido: string): Promise<Comentario> {
  try {
    const respuesta = await api.put<{ data: ComentarioServidor }>(`/api/v1/comentarios/${encodeURIComponent(id)}`, { contenido })
    return comentarioDesdeServidor(respuesta.data)
  } catch (error) {
    relanzarError(error)
  }
}

export async function eliminarComentario(id: string): Promise<void> {
  await api.delete(`/api/v1/comentarios/${encodeURIComponent(id)}`)
}
