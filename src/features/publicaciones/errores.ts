import { ApiError } from '@/shared/api/apiError'

// Mensaje para una acción que falló (reaccionar, comentar, seguir...). En un 403 el servidor dice el
// motivo en español (por ejemplo, «Completa tu perfil antes de comentar.»), así que se usa ese.
export function mensajeDeError(error: unknown, porDefecto: string): string {
  if (error instanceof ApiError) {
    if (error.status === 403 && error.mensajeServidor) return error.mensajeServidor
    // Un 5xx puede traer un texto técnico en inglés: se usa el mensaje por defecto.
    if (error.status < 500) return error.message
  }
  return porDefecto
}
