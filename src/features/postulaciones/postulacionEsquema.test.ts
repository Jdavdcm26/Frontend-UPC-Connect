import { describe, expect, it } from 'vitest'
import { LIMITES_POSTULACION } from '@/features/postulaciones/limites'
import { postulacionEsquema } from '@/features/postulaciones/postulacionEsquema'

describe('postulacionEsquema', () => {
  it('acepta un mensaje vacío, porque es opcional', () => {
    expect(postulacionEsquema.safeParse({ mensaje: '' }).success).toBe(true)
  })

  it('acepta un mensaje dentro del límite', () => {
    expect(postulacionEsquema.safeParse({ mensaje: 'Me interesa mucho la vacante.' }).success).toBe(true)
  })

  it('rechaza un mensaje más largo que el máximo', () => {
    const mensaje = 'a'.repeat(LIMITES_POSTULACION.mensaje + 1)
    expect(postulacionEsquema.safeParse({ mensaje }).success).toBe(false)
  })

  it('no cuenta los espacios de los extremos', () => {
    const mensaje = ` ${'a'.repeat(LIMITES_POSTULACION.mensaje)} `
    expect(postulacionEsquema.safeParse({ mensaje }).success).toBe(true)
  })
})