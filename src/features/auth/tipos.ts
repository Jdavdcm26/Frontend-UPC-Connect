// Rol que usa la interfaz: candidato (estudiante o egresado), empresa, o una cuenta
// administrativa (moderador o admin), que no tiene pantallas en la aplicación.
export type Rol = 'candidato' | 'empresa' | 'moderador' | 'admin'

export type EstadoCuenta = 'ACTIVO' | 'PENDIENTE' | 'SUSPENDIDO'

export type Usuario = {
  id: string
  correo: string
  rol: Rol
  // Los egresados tienen año de grado en su perfil.
  esEgresado: boolean
  estado: EstadoCuenta
}