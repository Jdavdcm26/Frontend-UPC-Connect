import type { RestablecerDatos } from '@/features/auth/recuperacionEsquema'
import { USAR_FIXTURES } from '@/features/auth/sesionApi'
import { ApiError } from '@/shared/api/apiError'
import { api } from '@/shared/api/client'

const pausa = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

// Pide el correo de recuperación. El servidor responde igual exista o no la cuenta.
export async function solicitarRecuperacionApi(correo: string): Promise<void> {
  if (USAR_FIXTURES) {
    await pausa(600)
    return
  }
  await api.post('/api/v1/auth/forgot-password', { email: correo })
}

// Guarda la contraseña nueva. "consulta" es lo que viene después del ? del enlace
// (trae el token y el correo). Con fixtures falla si contiene "vencido".
export async function restablecerContrasenaApi(consulta: string, datos: RestablecerDatos): Promise<void> {
  if (USAR_FIXTURES) {
    await pausa(600)
    if (consulta.includes('vencido')) {
      throw new ApiError(422, 'El enlace venció o no es válido. Pide uno nuevo.')
    }
    return
  }
  const parametros = new URLSearchParams(consulta)
  await api.post('/api/v1/auth/reset-password', {
    token: parametros.get('token'),
    email: parametros.get('email'),
    password: datos.contrasena,
    password_confirmation: datos.confirmacion,
  })
}