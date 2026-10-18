import { describe, expect, it } from 'vitest'
import { ANIO_GRADO_MIN, LIMITES, SEMESTRE_MAX } from '@/features/perfil/limites'
import { esquemaPerfil } from '@/features/perfil/perfilEsquema'

const datosEstudiante = {
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

const datosEgresado = { ...datosEstudiante, semestre: '', anioGrado: '2025' }

const estudiante = esquemaPerfil(false)
const egresado = esquemaPerfil(true)

describe('perfil de estudiante', () => {
  it('acepta un perfil válido', () => {
    expect(estudiante.safeParse(datosEstudiante).success).toBe(true)
  })

  it('exige la carrera', () => {
    expect(estudiante.safeParse({ ...datosEstudiante, carreraId: '' }).success).toBe(false)
  })

  it('exige el semestre', () => {
    expect(estudiante.safeParse({ ...datosEstudiante, semestre: '' }).success).toBe(false)
  })

  it('rechaza un semestre fuera de rango', () => {
    expect(estudiante.safeParse({ ...datosEstudiante, semestre: '0' }).success).toBe(false)
    expect(estudiante.safeParse({ ...datosEstudiante, semestre: String(SEMESTRE_MAX + 1) }).success).toBe(false)
  })

  it('rechaza un titular más largo que el máximo', () => {
    const titular = 'a'.repeat(LIMITES.titular + 1)
    expect(estudiante.safeParse({ ...datosEstudiante, titular }).success).toBe(false)
  })

  it('rechaza más intereses que el máximo', () => {
    const intereses = Array.from({ length: LIMITES.intereses + 1 }, (_, i) => `interes${i}`)
    expect(estudiante.safeParse({ ...datosEstudiante, intereses }).success).toBe(false)
  })
})

describe('perfil de egresado', () => {
  it('acepta un perfil válido sin semestre', () => {
    expect(egresado.safeParse(datosEgresado).success).toBe(true)
  })

  it('exige el año de grado', () => {
    expect(egresado.safeParse({ ...datosEgresado, anioGrado: '' }).success).toBe(false)
  })

  it('rechaza un año de grado que no tiene cuatro cifras', () => {
    expect(egresado.safeParse({ ...datosEgresado, anioGrado: '25' }).success).toBe(false)
  })

  it('rechaza un año anterior a la fundación de la UPC o futuro', () => {
    expect(egresado.safeParse({ ...datosEgresado, anioGrado: String(ANIO_GRADO_MIN - 1) }).success).toBe(false)
    expect(egresado.safeParse({ ...datosEgresado, anioGrado: String(new Date().getFullYear() + 1) }).success).toBe(false)
    expect(egresado.safeParse({ ...datosEgresado, anioGrado: String(ANIO_GRADO_MIN) }).success).toBe(true)
  })
})