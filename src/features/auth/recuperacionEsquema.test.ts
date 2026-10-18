import { describe, expect, it } from 'vitest'
import { restablecerEsquema, solicitarRecuperacionEsquema } from '@/features/auth/recuperacionEsquema'

describe('solicitarRecuperacionEsquema', () => {
  it('acepta un correo válido', () => {
    expect(solicitarRecuperacionEsquema.safeParse({ correo: 'ana@upc.edu.co' }).success).toBe(true)
  })

  it('rechaza un correo mal escrito', () => {
    expect(solicitarRecuperacionEsquema.safeParse({ correo: 'ana' }).success).toBe(false)
  })
})

describe('restablecerEsquema', () => {
  it('acepta contraseñas iguales de 10 o más caracteres', () => {
    const datos = { contrasena: 'clave-nueva-123', confirmacion: 'clave-nueva-123' }
    expect(restablecerEsquema.safeParse(datos).success).toBe(true)
  })

  it('rechaza una contraseña de menos de 10 caracteres', () => {
    const datos = { contrasena: 'corta', confirmacion: 'corta' }
    expect(restablecerEsquema.safeParse(datos).success).toBe(false)
  })

  it('rechaza cuando la confirmación no coincide', () => {
    const datos = { contrasena: 'clave-nueva-123', confirmacion: 'otra-clave-123' }
    expect(restablecerEsquema.safeParse(datos).success).toBe(false)
  })
})