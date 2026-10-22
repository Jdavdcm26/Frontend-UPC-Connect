import { describe, expect, it } from 'vitest'
import { mensajeDeError } from '@/features/publicaciones/errores'
import { ApiError } from '@/shared/api/apiError'

describe('mensajeDeError', () => {
  it('en un 403 usa el motivo que dio el servidor', () => {
    const error = new ApiError(403, 'No tienes permiso.', {}, undefined, 'Completa tu perfil antes de comentar.')
    expect(mensajeDeError(error, 'Falló')).toBe('Completa tu perfil antes de comentar.')
  })

  it('en otros errores de la API usa su mensaje en español', () => {
    expect(mensajeDeError(new ApiError(0, 'No hay conexión.'), 'Falló')).toBe('No hay conexión.')
  })

  it('en un error del servidor o desconocido usa el mensaje por defecto', () => {
    expect(mensajeDeError(new ApiError(500, 'Server Error'), 'Falló')).toBe('Falló')
    expect(mensajeDeError(new Error('x'), 'Falló')).toBe('Falló')
  })
})
