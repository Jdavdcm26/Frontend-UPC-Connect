import { describe, expect, it } from 'vitest'
import { etiquetaNivel, resumenAcademico, slugDesdeNombre } from '@/features/perfil/formato'

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

describe('slugDesdeNombre', () => {
  it('quita tildes y pasa a minúsculas con guiones', () => {
    expect(slugDesdeNombre('Ana', 'Pérez')).toBe('ana-perez')
  })

  it('une varios nombres y apellidos sin guiones de más', () => {
    expect(slugDesdeNombre('José  Luis', 'Núñez-Díaz ')).toBe('jose-luis-nunez-diaz')
  })
})


describe('etiquetaNivel', () => {
  it('muestra el nivel de la habilidad en español', () => {
    expect(etiquetaNivel('BASICO')).toBe('Básico')
    expect(etiquetaNivel('INTERMEDIO')).toBe('Intermedio')
    expect(etiquetaNivel('AVANZADO')).toBe('Avanzado')
  })
})
