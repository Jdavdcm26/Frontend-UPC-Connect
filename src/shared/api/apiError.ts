// Error normalizado de la API: el resto de la app solo maneja esta clase.
export class ApiError extends Error {
  status: number
  campos: Record<string, string[]>
  // Segundos que hay que esperar antes de reintentar (cabecera Retry-After en un 429).
  reintentarEn?: number

  constructor(
    status: number,
    message: string,
    campos: Record<string, string[]> = {},
    reintentarEn?: number,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.campos = campos
    this.reintentarEn = reintentarEn
  }
}