import { describe, expect, it } from 'vitest'
import { LIMITES, SEMESTRE_MAX } from '@/features/perfil/limites'
import { perfilEsquema } from '@/features/perfil/perfilEsquema'

const datosValidos = {
  nombres: 'Ana María',
  apellidos: 'Pérez',
  titular: 'Estudiante de Ingeniería de Sistemas',
  descripcion: 'Me interesa el desarrollo web.',
  carreraId: '3',
  semestre: '6',
  anioGrado: '',
  ciudad: 'Valledupar',
  intereses: ['React', 'Datos'],
}

describe('perfilEsquema', () => {
  it('acepta un perfil válido', () => {
    expect(perfilEsquema.safeParse(datosValidos).success).toBe(true)
  })

  it('exige la carrera', () => {
    const resultado = perfilEsquema.safeParse({ ...datosValidos, carreraId: '' })
    expect(resultado.success).toBe(false)
  })

  it('exige el semestre', () => {
    const resultado = perfilEsquema.safeParse({ ...datosValidos, semestre: '' })
    expect(resultado.success).toBe(false)
  })

  it('rechaza un semestre fuera de rango', () => {
    expect(perfilEsquema.safeParse({ ...datosValidos, semestre: '0' }).success).toBe(false)
    expect(perfilEsquema.safeParse({ ...datosValidos, semestre: String(SEMESTRE_MAX + 1) }).success).toBe(false)
  })

  it('rechaza un titular más largo que el máximo', () => {
    const titular = 'a'.repeat(LIMITES.titular + 1)
    expect(perfilEsquema.safeParse({ ...datosValidos, titular }).success).toBe(false)
  })

  it('rechaza un año de grado que no tiene cuatro cifras', () => {
    expect(perfilEsquema.safeParse({ ...datosValidos, anioGrado: '25' }).success).toBe(false)
    expect(perfilEsquema.safeParse({ ...datosValidos, anioGrado: '2025' }).success).toBe(true)
  })

  it('rechaza más intereses que el máximo', () => {
    const intereses = Array.from({ length: LIMITES.intereses + 1 }, (_, i) => `interes${i}`)
    expect(perfilEsquema.safeParse({ ...datosValidos, intereses }).success).toBe(false)
  })
})