import { describe, expect, it } from 'vitest'
import { registroEsquema } from '@/features/auth/registroEsquema'

const datosValidos = {
  correo: 'estudiante@upc.edu.co',
  contrasena: 'clave-segura-123',
  confirmacion: 'clave-segura-123',
  aceptaPolitica: true,
}

describe('registroEsquema', () => {
  it('acepta datos válidos', () => {
    expect(registroEsquema.safeParse(datosValidos).success).toBe(true)
  })

  it('rechaza un correo mal escrito', () => {
    const resultado = registroEsquema.safeParse({ ...datosValidos, correo: 'no-es-correo' })
    expect(resultado.success).toBe(false)
  })

  it('rechaza una contraseña de menos de 10 caracteres', () => {
    const resultado = registroEsquema.safeParse({
      ...datosValidos,
      contrasena: 'corta',
      confirmacion: 'corta',
    })
    expect(resultado.success).toBe(false)
  })

  it('rechaza cuando la confirmación no coincide', () => {
    const resultado = registroEsquema.safeParse({ ...datosValidos, confirmacion: 'otra-clave-123' })
    expect(resultado.success).toBe(false)
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toEqual(['confirmacion'])
    }
  })

  it('rechaza cuando no se acepta la política', () => {
    const resultado = registroEsquema.safeParse({ ...datosValidos, aceptaPolitica: false })
    expect(resultado.success).toBe(false)
    if (!resultado.success) {
      expect(resultado.error.issues[0].path).toEqual(['aceptaPolitica'])
    }
  })
})