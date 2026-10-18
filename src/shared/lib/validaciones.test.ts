import { describe, expect, it } from 'vitest'
import { contrasena, correo, textoObligatorio, urlOpcional } from '@/shared/lib/validaciones'

describe('validaciones', () => {
  it('acepta un correo válido y rechaza uno incompleto', () => {
    expect(correo.safeParse('ana@unicesar.edu.co').success).toBe(true)
    expect(correo.safeParse('ana@').success).toBe(false)
  })

  it('exige contraseña de al menos 10 caracteres', () => {
    expect(contrasena.safeParse('corta').success).toBe(false)
    expect(contrasena.safeParse('una-clave-larga').success).toBe(true)
  })

  it('textoObligatorio rechaza vacío y texto demasiado largo', () => {
    const nombre = textoObligatorio('nombre', 10)
    expect(nombre.safeParse('   ').success).toBe(false)
    expect(nombre.safeParse('a'.repeat(11)).success).toBe(false)
    expect(nombre.safeParse('Ana').success).toBe(true)
  })

  it('urlOpcional acepta vacío o URL válida, pero no texto suelto', () => {
    expect(urlOpcional.safeParse('').success).toBe(true)
    expect(urlOpcional.safeParse('https://ejemplo.com').success).toBe(true)
    expect(urlOpcional.safeParse('ejemplo').success).toBe(false)
  })
})