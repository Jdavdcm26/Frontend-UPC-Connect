// Estados de una postulación. Los nombres deben coincidir con los del correo de aviso (HU-48).
export const ESTADOS_POSTULACION = [
  'RECIBIDA',
  'EN_REVISION',
  'ENTREVISTA',
  'SELECCIONADO',
  'NO_SELECCIONADO',
] as const

export type EstadoPostulacion = (typeof ESTADOS_POSTULACION)[number]

// Textos que ve la persona.
export const ETIQUETA_ESTADO_POSTULACION: Record<EstadoPostulacion, string> = {
  RECIBIDA: 'Recibida',
  EN_REVISION: 'En revisión',
  ENTREVISTA: 'Entrevista',
  SELECCIONADO: 'Seleccionado',
  NO_SELECCIONADO: 'No seleccionado',
}

export type Postulacion = {
  id: string
  vacanteId: string
  vacanteTitulo: string
  // Nombre de la empresa que publicó la vacante.
  empresa: string
  // Mensaje opcional del candidato (cadena vacía si no escribió).
  mensaje: string
  estado: EstadoPostulacion
  // Fecha y hora de envío en formato ISO.
  creadaEn: string
}

// Un cambio en el historial de una postulación (HU-47).
export type CambioEstado = {
  estado: EstadoPostulacion
  // Fecha y hora del cambio en formato ISO.
  fecha: string
  // Quién hizo el cambio.
  responsable: string
}

// Datos del candidato que la empresa puede ver.
export type CandidatoVisible = {
  nombres: string
  apellidos: string
  titular: string
  descripcion: string
  // Nombre de la carrera.
  carrera: string
  // Los egresados no tienen semestre.
  semestre: number | null
  // Solo para egresados.
  anioGrado: number | null
  ciudad: string
  intereses: string[]
}

// Fila de la lista de postulaciones recibidas por una vacante (HU-47 / FE-25).
export type PostulacionRecibida = {
  id: string
  estado: EstadoPostulacion
  creadaEn: string
  // Nombres y apellidos del candidato.
  nombre: string
  carrera: string
  semestre: number | null
  anioGrado: number | null
}

// Detalle de una postulación recibida: mensaje, perfil visible e historial.
export type DetallePostulacionRecibida = {
  id: string
  estado: EstadoPostulacion
  creadaEn: string
  mensaje: string
  candidato: CandidatoVisible
  historial: CambioEstado[]
}