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