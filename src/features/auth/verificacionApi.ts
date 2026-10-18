import { USAR_FIXTURES } from '@/features/auth/sesionApi'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/apiError'

const pausa = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

// Confirma el correo con los datos del enlace recibido (HU-01 / FE-11).
// "consulta" es lo que viene después del ? en la URL, tal cual llegó.
// Con fixtures: cualquier enlace funciona, salvo si contiene "vencido".
export async function verificarCorreoApi(consulta: string): Promise<void> {
  if (USAR_FIXTURES) {
    await pausa(600)
    if (consulta.includes('vencido')) {
      throw new ApiError(422, 'El enlace venció o no es válido. Pide uno nuevo.')
    }
    return
  }
  await api.post(`/api/v1/auth/email/verify${consulta}`)
}

// Pide un nuevo enlace de verificación (el servidor limita cuántos se envían).
export async function reenviarVerificacionApi(correo: string): Promise<void> {
  if (USAR_FIXTURES) {
    await pausa(600)
    return
  }
  await api.post('/api/v1/auth/email/resend', { email: correo })
}