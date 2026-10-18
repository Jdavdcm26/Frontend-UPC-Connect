import { describe, expect, it } from 'vitest'
import { resumenAcademico } from '@/features/perfil/formato'

describe('resumenAcademico', () => {
  it('un estudiante muestra el semestre', () => {
    expect(resumenAcademico({ carrera: 'Derecho', semestre: 6, anioGrado: null })).toBe('Derecho · Semestre 6')
  })

  it('un egresado muestra el año de grado y no el semestre', () => {
    expect(resumenAcademico({ carrera: 'Derecho', semestre: null, anioGrado: 2025 })).toBe(
      'Derecho · Egresado en 2025',
    )
  })

  it('sin nombre de carrera solo muestra lo demás', () => {
    expect(resumenAcademico({ carrera: '', semestre: 3, anioGrado: null })).toBe('Semestre 3')
  })
})