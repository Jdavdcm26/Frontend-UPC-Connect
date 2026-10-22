import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { ApiError } from '@/shared/api/apiError'

// Pasa los errores 422 del servidor a cada campo del formulario.
// Devuelve true si el error era de validación y se aplicó a los campos.
export function aplicarErroresServidor<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
): boolean {
  if (!(error instanceof ApiError) || error.status !== 422) return false
  for (const [campo, mensajes] of Object.entries(error.campos)) {
    setError(campo as Path<T>, { type: 'server', message: mensajes[0] })
  }
  return true
}

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
