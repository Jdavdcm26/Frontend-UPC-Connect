// Rol de la persona: define a qué diseño y pantallas tiene acceso.
// El administrador entra por el panel de Filament, no por esta aplicación.
export type Rol = 'candidato' | 'empresa'

// Estado de la cuenta. PENDIENTE y SUSPENDIDO no entran a rutas protegidas.
export type EstadoCuenta = 'ACTIVO' | 'PENDIENTE' | 'SUSPENDIDO'

// Usuario con sesión iniciada (respuesta de GET /api/v1/me).
export type Usuario = {
  id: number
  correo: string
  rol: Rol
  estado: EstadoCuenta
}