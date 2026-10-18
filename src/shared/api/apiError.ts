// Error de la API que conserva el código HTTP (401, 403, 422, ...)
// para decidir qué hacer según el caso (reintentar, cerrar sesión, avisar).
export class ApiError extends Error {
  status: number
  // Errores de validación por campo (respuesta 422), ej: { correo: ['Correo no válido'] }
  campos: Record<string, string[]>

  constructor(status: number, message: string, campos: Record<string, string[]> = {}) {
    super(message)
    this.status = status
    this.campos = campos
  }
}