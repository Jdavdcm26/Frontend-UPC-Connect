// Relación de quien mira con el dueño de un perfil (HU-28, HU-31).
export type RedPerfil = {
  // Id de la cuenta dueña del perfil: con él se sigue, se bloquea y se filtran sus publicaciones.
  usuarioId: string
  seguidores: number
  seguidos: number
  loSigues: boolean
  loBloqueaste: boolean
}

// Contadores del perfil propio.
export type RedPropia = {
  seguidores: number
  seguidos: number
}

export type RolBloqueado = 'ESTUDIANTE' | 'EGRESADO' | 'EMPRESA'

export const ETIQUETA_ROL_BLOQUEADO: Record<RolBloqueado, string> = {
  ESTUDIANTE: 'Estudiante',
  EGRESADO: 'Egresado',
  EMPRESA: 'Empresa',
}

// Cuenta que la persona bloqueó.
export type CuentaBloqueada = {
  id: string
  nombre: string
  rol: RolBloqueado
  // Solo estudiantes y egresados tienen perfil que abrir.
  slug: string | null
  bloqueadaEn: string
}
