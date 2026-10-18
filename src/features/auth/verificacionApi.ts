import { USAR_FIXTURES } from '@/features/auth/sesionApi'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/apiError'

const pausa = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

// Confirma el correo con los datos del enlace recibido (HU-02 / FE-11).
// "consulta" es lo que viene después del ? en la URL: trae id, hash y la firma.
// Con fixtures: cualquier enlace funciona, salvo si contiene "vencido" o "usado".
export async function verificarCorreoApi(consulta: string): Promise<void> {
  if (USAR_FIXTURES) {
    await pausa(600)
    if (consulta.includes('vencido')) {
      throw new ApiError(422, 'El enlace venció. Pide uno nuevo.')
    }
    if (consulta.includes('usado')) {
      throw new ApiError(422, 'Este enlace ya fue usado. Si tu cuenta ya está verificada, inicia sesión.')
    }
    return
  }
  // GET /api/v1/auth/email/verify/{id}/{hash}?expires=...&signature=... (API-03)
  const parametros = new URLSearchParams(consulta)
  const id = parametros.get('id')
  const hash = parametros.get('hash')
  parametros.delete('id')
  parametros.delete('hash')
  try {
    await api.get(`/api/v1/auth/email/verify/${id}/${hash}?${parametros.toString()}`)
  } catch (error) {
    // Un enlace inválido responde 403: se muestra el mensaje del servidor, no el genérico.
    if (error instanceof ApiError && error.status === 403) {
      throw new ApiError(403, error.mensajeServidor ?? 'El enlace no es válido. Pide uno nuevo.')
    }
    throw error
  }
}

// Pide un nuevo enlace de verificación (el servidor limita cuántos se envían) (API-04).
export async function reenviarVerificacionApi(correo: string): Promise<void> {
  if (USAR_FIXTURES) {
    await pausa(600)
    return
  }
  await api.post('/api/v1/auth/email/verification-notification', { email: correo })
}