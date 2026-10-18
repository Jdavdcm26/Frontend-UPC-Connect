import { describe, expect, it } from 'vitest'
import { loginEsquema } from '@/features/auth/loginEsquema'

describe('loginEsquema', () => {
  it('acepta correo y contraseña escritos', () => {
    const resultado = loginEsquema.safeParse({ correo: 'estudiante@upc.edu.co', contrasena: 'x' })
    expect(resultado.success).toBe(true)
  })

  it('rechaza un correo mal escrito', () => {
    const resultado = loginEsquema.safeParse({ correo: 'no-es-correo', contrasena: 'clave' })
    expect(resultado.success).toBe(false)
  })

  it('rechaza la contraseña vacía', () => {
    const resultado = loginEsquema.safeParse({ correo: 'estudiante@upc.edu.co', contrasena: '' })
    expect(resultado.success).toBe(false)
  })
})