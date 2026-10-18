import { describe, expect, it } from 'vitest'
import { LIMITES_VACANTE } from '@/features/vacantes/limites'
import { vacanteEsquema } from '@/features/vacantes/vacanteEsquema'
import { hoyLocal } from '@/shared/lib/fechas'

const datosValidos = {
  tipo: 'PRACTICA',
  titulo: 'Practicante de desarrollo web',
  descripcion: 'Apoyarás al equipo en el desarrollo de la plataforma.',
  requisitos: 'Cursando entre sexto y décimo semestre.',
  carreraIds: ['1'],
  ciudad: 'Valledupar',
  modalidad: 'HIBRIDA',
  fechaCierre: '2999-12-31',
}

describe('vacanteEsquema', () => {
  it('acepta una vacante válida', () => {
    expect(vacanteEsquema.safeParse(datosValidos).success).toBe(true)
  })

  it('exige elegir el tipo', () => {
    expect(vacanteEsquema.safeParse({ ...datosValidos, tipo: '' }).success).toBe(false)
  })

  it('exige el título', () => {
    expect(vacanteEsquema.safeParse({ ...datosValidos, titulo: '   ' }).success).toBe(false)
  })

  it('rechaza una descripción más larga que el máximo', () => {
    const descripcion = 'a'.repeat(LIMITES_VACANTE.descripcion + 1)
    expect(vacanteEsquema.safeParse({ ...datosValidos, descripcion }).success).toBe(false)
  })

  it('admite como máximo las carreras permitidas', () => {
    const demasiadas = Array.from({ length: LIMITES_VACANTE.carreras + 1 }, (_, i) => `carrera-${i}`)
    expect(vacanteEsquema.safeParse({ ...datosValidos, carreraIds: demasiadas }).success).toBe(false)
  })

  it('exige al menos una carrera objetivo', () => {
    expect(vacanteEsquema.safeParse({ ...datosValidos, carreraIds: [] }).success).toBe(false)
  })

  it('rechaza una fecha de cierre pasada', () => {
    expect(vacanteEsquema.safeParse({ ...datosValidos, fechaCierre: '2020-01-01' }).success).toBe(false)
  })

  it('acepta una fecha de cierre de hoy', () => {
    expect(vacanteEsquema.safeParse({ ...datosValidos, fechaCierre: hoyLocal() }).success).toBe(true)
  })
})