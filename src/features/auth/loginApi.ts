import { iniciarSesionDemo, USAR_FIXTURES } from '@/features/auth/sesionApi'
import type { LoginDatos } from '@/features/auth/loginEsquema'
import { api } from '@/shared/api/client'
import { ApiError } from '@/shared/api/apiError'

function mensajeBloqueo(segundos?: number): string {
  if (!segundos) return 'Demasiados intentos fallidos. Espera unos minutos e intenta de nuevo.'
  const minutos = Math.max(1, Math.ceil(segundos / 60))
  return `Demasiados intentos fallidos. Intenta de nuevo en ${minutos} ${minutos === 1 ? 'minuto' : 'minutos'}.`
}

const CREDENCIALES_INVALIDAS = 'Correo o contraseña incorrectos. Revísalos e intenta de nuevo.'

// Inicia sesión (HU-02 / FE-12). La sesión queda en una cookie, no en el navegador.
// Con fixtures: contraseña "incorrecta" falla y "bloqueada" simula el bloqueo de 5 intentos.
export async function iniciarSesionApi(datos: LoginDatos): Promise<void> {
  if (USAR_FIXTURES) {
    await new Promise((resolver) => setTimeout(resolver, 600))
    if (datos.contrasena === 'incorrecta') throw new ApiError(401, CREDENCIALES_INVALIDAS)
    if (datos.contrasena === 'bloqueada') throw new ApiError(429, mensajeBloqueo(300), {}, 300)
    iniciarSesionDemo({
      id: 1,
      correo: datos.correo,
      rol: datos.correo.includes('empresa') ? 'empresa' : 'candidato',
      estado: datos.correo.includes('pendiente')
        ? 'PENDIENTE'
        : datos.correo.includes('suspendido')
          ? 'SUSPENDIDO'
          : 'ACTIVO',
    })
    return
  }
  try {
    await api.post('/api/v1/auth/login', { email: datos.correo, password: datos.contrasena })
  } catch (error) {
    if (error instanceof ApiError) {
      // Credenciales inválidas: Laravel responde 401 o 422.
      if (error.status === 401 || error.status === 422) throw new ApiError(401, CREDENCIALES_INVALIDAS)
      if (error.status === 429) throw new ApiError(429, mensajeBloqueo(error.reintentarEn), {}, error.reintentarEn)
    }
    throw error
  }
}