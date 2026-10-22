import type { Modalidad } from '@/features/vacantes/tipos'

// Tipos de publicación de la comunidad (HU-18 a HU-20), tal como los define el servidor.
export const TIPOS_PUBLICACION = ['GENERAL', 'SERVICIO', 'BUSQUEDA_EQUIPO'] as const
export type TipoPublicacion = (typeof TIPOS_PUBLICACION)[number]

// Textos que ve la persona.
export const ETIQUETA_TIPO_PUBLICACION: Record<TipoPublicacion, string> = {
  GENERAL: 'General',
  SERVICIO: 'Servicio',
  BUSQUEDA_EQUIPO: 'Búsqueda de equipo',
}

// Explicación breve de cada tipo, para el formulario.
export const AYUDA_TIPO_PUBLICACION: Record<TipoPublicacion, string> = {
  GENERAL: 'Comparte una idea, un logro o una pregunta con la comunidad.',
  SERVICIO: 'Ofrece una asesoría o un servicio: di en qué área, cómo y cuándo.',
  BUSQUEDA_EQUIPO: 'Busca personas para un proyecto: cuéntales qué perfiles necesitas.',
}

// Feed completo de la universidad o solo de las personas que sigues (HU-24).
export const ALCANCES = ['comunidad', 'seguidos'] as const
export type Alcance = (typeof ALCANCES)[number]

export type Categoria = {
  id: string
  nombre: string
}

// Quien escribe una publicación o un comentario. El servidor puede no tener su perfil (datos nulos).
export type Autor = {
  id: string
  nombres: string
  apellidos: string
  // «Ana Pérez», o un texto genérico si la cuenta ya no tiene perfil.
  nombreCompleto: string
  titular: string
  // Sin slug no hay perfil que abrir.
  slug: string | null
  carrera: string
}

// Plantilla de un servicio (HU-19).
export type DetallesServicio = {
  tipo: 'SERVICIO'
  area: string
  modalidad: Modalidad
  disponibilidad: string
}

// Plantilla de una búsqueda de equipo (HU-20).
export type DetallesEquipo = {
  tipo: 'BUSQUEDA_EQUIPO'
  proyecto: string
  perfilesRequeridos: string
  cupos: number
}

export type ImagenPublicacion = {
  id: string
  url: string
}

export type Publicacion = {
  id: string
  tipo: TipoPublicacion
  categoria: Categoria
  contenido: string
  // Solo en servicios y búsquedas de equipo.
  detalles: DetallesServicio | DetallesEquipo | null
  // Si el servicio o la búsqueda sigue disponible. Null en las publicaciones generales.
  abierta: boolean | null
  // Ocultada por moderación: solo la ve su autor y ya no se puede editar.
  oculta: boolean
  imagenes: ImagenPublicacion[]
  autor: Autor
  reacciones: number
  comentarios: number
  // Si quien mira ya reaccionó.
  reaccione: boolean
  esMia: boolean
  // Fecha y hora ISO; null si nunca se editó.
  editadaEn: string | null
  creadaEn: string
}

export type Comentario = {
  id: string
  contenido: string
  autor: Autor
  esMio: boolean
  editadoEn: string | null
  creadoEn: string
}

// Lo que importa de la reacción de quien mira: el total y si reaccionó.
export type EstadoReaccion = {
  reacciones: number
  reaccione: boolean
}
