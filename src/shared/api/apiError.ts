// Error de la API que conserva el código HTTP (401, 403, 422, ...)
// para decidir qué hacer según el caso (reintentar, cerrar sesión, avisar).
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}