// Valores de la vacante tal como los define el modelo de datos del proyecto.
export const TIPOS_VACANTE = ['VACANTE', 'PRACTICA', 'PASANTIA'] as const
export const MODALIDADES = ['PRESENCIAL', 'REMOTA', 'HIBRIDA'] as const
export const ESTADOS_VACANTE = ['ACTIVA', 'PAUSADA', 'CERRADA'] as const

export type TipoVacante = (typeof TIPOS_VACANTE)[number]
export type Modalidad = (typeof MODALIDADES)[number]
export type EstadoVacante = (typeof ESTADOS_VACANTE)[number]

// Textos que ve la persona.
export const ETIQUETA_TIPO: Record<TipoVacante, string> = {
  VACANTE: 'Vacante',
  PRACTICA: 'Práctica',
  PASANTIA: 'Pasantía',
}

export const ETIQUETA_MODALIDAD: Record<Modalidad, string> = {
  PRESENCIAL: 'Presencial',
  REMOTA: 'Remota',
  HIBRIDA: 'Híbrida',
}

export const ETIQUETA_ESTADO: Record<EstadoVacante, string> = {
  ACTIVA: 'Activa',
  PAUSADA: 'Pausada',
  CERRADA: 'Cerrada',
}

export type Vacante = {
  id: string
  tipo: TipoVacante
  titulo: string
  descripcion: string
  requisitos: string
  ciudad: string
  modalidad: Modalidad
  estado: EstadoVacante
  // Fecha en formato AAAA-MM-DD.
  fechaCierre: string
  carreraIds: number[]
  // Nombre de la empresa que publica.
  empresa: string
}