import { USAR_FIXTURES } from '@/features/auth/sesionApi'
import type { RegistroDatos } from '@/features/auth/registroEsquema'
import { api } from '@/shared/api/client'

// Crea la cuenta (HU-01). El servidor envía el correo de verificación.
// Con fixtures activados no se llama al servidor: se simula un registro exitoso.
export async function registrarApi(datos: RegistroDatos): Promise<void> {
  if (USAR_FIXTURES) {
    await new Promise((resolver) => setTimeout(resolver, 600))
    return
  }
  await api.post('/api/v1/auth/register', {
    email: datos.correo,
    password: datos.contrasena,
    password_confirmation: datos.confirmacion,
  })
}