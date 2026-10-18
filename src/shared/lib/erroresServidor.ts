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