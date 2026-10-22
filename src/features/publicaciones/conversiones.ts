import type { PublicacionDatos } from '@/features/publicaciones/publicacionEsquema'
import type {
  Autor,
  Comentario,
  EstadoReaccion,
  Publicacion,
  TipoPublicacion,
} from '@/features/publicaciones/tipos'
import type { Modalidad } from '@/features/vacantes/tipos'

// ---------- Contrato con el servidor ----------

// Autor de una publicación o comentario (AutorResource). Sin perfil, los datos llegan nulos.
export type AutorServidor = {
  id: string
  nombres: string | null
  apellidos: string | null
  titular: string | null
  slug: string | null
  carrera: string | null
}

// Plantillas de cada tipo, como las guarda el servidor. Null en las publicaciones generales.
export type DetallesServidor =
  | { area: string; modalidad: Modalidad; disponibilidad: string }
  | { proyecto: string; perfiles_requeridos: string; cupos: number }
  | null

// Publicación (PublicacionResource).
export type PublicacionServidor = {
  id: string
  tipo: TipoPublicacion
  categoria: { id: string; nombre: string }
  contenido: string
  detalles: DetallesServidor
  abierta: boolean | null
  estado: 'VISIBLE' | 'OCULTO'
  imagenes: { id: string; url: string }[]
  autor: AutorServidor
  reacciones: number
  comentarios: number
  reaccione: boolean
  es_mia: boolean
  editada_en: string | null
  creada_en: string
}

// Comentario (ComentarioResource).
export type ComentarioServidor = {
  id: string
  contenido: string
  autor: AutorServidor
  es_mio: boolean
  editado_en: string | null
  creado_en: string
}

// ---------- Del servidor a la app ----------

export function autorDesdeServidor(a: AutorServidor): Autor {
  const nombres = a.nombres ?? ''
  const apellidos = a.apellidos ?? ''
  const nombreCompleto = `${nombres} ${apellidos}`.trim()
  return {
    id: a.id,
    nombres,
    apellidos,
    nombreCompleto: nombreCompleto || 'Persona de la comunidad',
    titular: a.titular ?? '',
    slug: a.slug,
    carrera: a.carrera ?? '',
  }
}

// La plantilla depende del tipo: se lee solo la que corresponde y el resto se descarta.
function detallesDesdeServidor(tipo: TipoPublicacion, d: DetallesServidor): Publicacion['detalles'] {
  if (d === null) return null
  if (tipo === 'SERVICIO' && 'area' in d) {
    return { tipo, area: d.area, modalidad: d.modalidad, disponibilidad: d.disponibilidad }
  }
  if (tipo === 'BUSQUEDA_EQUIPO' && 'proyecto' in d) {
    return { tipo, proyecto: d.proyecto, perfilesRequeridos: d.perfiles_requeridos, cupos: Number(d.cupos) }
  }
  return null
}

export function publicacionDesdeServidor(p: PublicacionServidor): Publicacion {
  return {
    id: p.id,
    tipo: p.tipo,
    categoria: { id: p.categoria.id, nombre: p.categoria.nombre },
    contenido: p.contenido,
    detalles: detallesDesdeServidor(p.tipo, p.detalles),
    abierta: p.tipo === 'GENERAL' ? null : p.abierta,
    oculta: p.estado === 'OCULTO',
    imagenes: p.imagenes,
    autor: autorDesdeServidor(p.autor),
    reacciones: p.reacciones,
    comentarios: p.comentarios,
    reaccione: p.reaccione,
    esMia: p.es_mia,
    editadaEn: p.editada_en,
    creadaEn: p.creada_en,
  }
}

export function comentarioDesdeServidor(c: ComentarioServidor): Comentario {
  return {
    id: c.id,
    contenido: c.contenido,
    autor: autorDesdeServidor(c.autor),
    esMio: c.es_mio,
    editadoEn: c.editado_en,
    creadoEn: c.creado_en,
  }
}

// ---------- De la app al servidor ----------

// Plantilla que se envía según el tipo; una publicación general no lleva detalles.
function detallesAServidor(datos: PublicacionDatos): Record<string, string | number> | null {
  if (datos.tipo === 'SERVICIO') {
    return { area: datos.area.trim(), modalidad: datos.modalidad, disponibilidad: datos.disponibilidad.trim() }
  }
  if (datos.tipo === 'BUSQUEDA_EQUIPO') {
    return {
      proyecto: datos.proyecto.trim(),
      perfiles_requeridos: datos.perfilesRequeridos.trim(),
      cupos: Number(datos.cupos),
    }
  }
  return null
}

// Cuerpo JSON de PUT /publicaciones/{id}. El tipo no se envía: al editar no cambia.
export function cuerpoEditarPublicacion(datos: PublicacionDatos) {
  const detalles = detallesAServidor(datos)
  return {
    categoria_id: datos.categoriaId,
    contenido: datos.contenido.trim(),
    ...(detalles ? { detalles } : {}),
  }
}

// Cuerpo JSON de POST /publicaciones cuando no hay imágenes.
export function cuerpoNuevaPublicacion(datos: PublicacionDatos) {
  return { tipo: datos.tipo, ...cuerpoEditarPublicacion(datos) }
}

// Cuerpo multipart de POST /publicaciones con imágenes. Los detalles van como detalles[campo]
// y las imágenes como imagenes[], que es como PHP arma los arreglos.
export function formularioNuevaPublicacion(datos: PublicacionDatos, imagenes: File[]): FormData {
  const formulario = new FormData()
  formulario.append('tipo', datos.tipo)
  formulario.append('categoria_id', datos.categoriaId)
  formulario.append('contenido', datos.contenido.trim())
  for (const [campo, valor] of Object.entries(detallesAServidor(datos) ?? {})) {
    formulario.append(`detalles[${campo}]`, String(valor))
  }
  for (const imagen of imagenes) formulario.append('imagenes[]', imagen)
  return formulario
}

// Valores del formulario a partir de una publicación existente (editar).
export function publicacionAFormulario(p: Publicacion): PublicacionDatos {
  const servicio = p.detalles?.tipo === 'SERVICIO' ? p.detalles : null
  const equipo = p.detalles?.tipo === 'BUSQUEDA_EQUIPO' ? p.detalles : null
  return {
    tipo: p.tipo,
    categoriaId: p.categoria.id,
    contenido: p.contenido,
    area: servicio?.area ?? '',
    modalidad: servicio?.modalidad ?? '',
    disponibilidad: servicio?.disponibilidad ?? '',
    proyecto: equipo?.proyecto ?? '',
    perfilesRequeridos: equipo?.perfilesRequeridos ?? '',
    cupos: equipo ? String(equipo.cupos) : '',
  }
}

// Nombres de campo del servidor -> nombres del formulario.
const CAMPOS: Record<string, string> = {
  categoria_id: 'categoriaId',
  'detalles.area': 'area',
  'detalles.modalidad': 'modalidad',
  'detalles.disponibilidad': 'disponibilidad',
  'detalles.proyecto': 'proyecto',
  'detalles.perfiles_requeridos': 'perfilesRequeridos',
  'detalles.cupos': 'cupos',
}

// Pasa los errores 422 del servidor a los nombres del formulario. Los de cada imagen («imagenes.0»)
// se juntan en «imagenes».
export function traducirCamposPublicacion(campos: Record<string, string[]>): Record<string, string[]> {
  const traducidos: Record<string, string[]> = {}
  for (const [campo, mensajes] of Object.entries(campos)) {
    const nombre = campo.startsWith('imagenes') ? 'imagenes' : (CAMPOS[campo] ?? campo)
    traducidos[nombre] = [...(traducidos[nombre] ?? []), ...mensajes]
  }
  return traducidos
}

// ---------- Reacciones ----------

// Cambio optimista al pulsar «Me gusta»: se ve de inmediato y se deshace si el servidor falla.
export function alternarReaccion(estado: EstadoReaccion): EstadoReaccion {
  return estado.reaccione
    ? { reacciones: Math.max(0, estado.reacciones - 1), reaccione: false }
    : { reacciones: estado.reacciones + 1, reaccione: true }
}
