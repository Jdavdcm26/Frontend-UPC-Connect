import { USAR_FIXTURES } from '@/features/auth/sesionApi'
import type { RegistroDatos } from '@/features/auth/registroEsquema'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/apiError'

// Nombres de campo del servidor -> nombres del formulario.
const CAMPOS: Record<string, string> = {
  email: 'correo',
  password: 'contrasena',
  password_confirmation: 'confirmacion',
}

function traducirCampos(campos: Record<string, string[]>): Record<string, string[]> {
  const traducidos: Record<string, string[]> = {}
  for (const [campo, mensajes] of Object.entries(campos)) {
    traducidos[CAMPOS[campo] ?? campo] = mensajes
  }
  return traducidos
}

// Crea la cuenta (HU-01). El servidor envía el correo de verificación.
// Con fixtures activados no se llama al servidor: se simula un registro exitoso.
export async function registrarApi(datos: RegistroDatos): Promise<void> {
  if (USAR_FIXTURES) {
    await new Promise((resolver) => setTimeout(resolver, 600))
    return
  }
  try {
    await api.post('/api/v1/auth/register', {
      email: datos.correo,
      password: datos.contrasena,
      password_confirmation: datos.confirmacion,
    })
  } catch (error) {
    if (error instanceof ApiError && error.status === 422) {
      throw new ApiError(422, error.message, traducirCampos(error.campos))
    }
    throw error
  }
}