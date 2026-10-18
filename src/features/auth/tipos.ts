// Rol que usa la interfaz: candidato (estudiante o egresado) o empresa.
export type Rol = 'candidato' | 'empresa'

export type EstadoCuenta = 'ACTIVO' | 'PENDIENTE' | 'SUSPENDIDO'

export type Usuario = {
  id: number
  correo: string
  rol: Rol
  // Los egresados tienen año de grado en su perfil.
  esEgresado: boolean
  estado: EstadoCuenta
}