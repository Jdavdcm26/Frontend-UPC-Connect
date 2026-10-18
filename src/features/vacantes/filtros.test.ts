import { describe, expect, it } from 'vitest'
import { FILTROS_VACIOS, filtrosAUrl, filtrosDesdeUrl } from '@/features/vacantes/filtros'

describe('filtrosDesdeUrl', () => {
  it('devuelve filtros vacíos si la URL no trae nada', () => {
    expect(filtrosDesdeUrl(new URLSearchParams())).toEqual(FILTROS_VACIOS)
  })

  it('lee todos los filtros válidos', () => {
    const params = new URLSearchParams('q=web&tipo=PRACTICA&modalidad=REMOTA&ciudad=Bogotá&carrera=3')
    expect(filtrosDesdeUrl(params)).toEqual({
      texto: 'web',
      tipo: 'PRACTICA',
      modalidad: 'REMOTA',
      ciudad: 'Bogotá',
      carreraId: '3',
    })
  })

  it('descarta tipo, modalidad y carrera inválidos', () => {
    const params = new URLSearchParams('tipo=XYZ&modalidad=nada&carrera=abc')
    expect(filtrosDesdeUrl(params)).toEqual(FILTROS_VACIOS)
  })
})

describe('filtrosAUrl', () => {
  it('no escribe los filtros vacíos', () => {
    expect(filtrosAUrl(FILTROS_VACIOS).toString()).toBe('')
  })

  it('escribe solo los filtros con valor', () => {
    const params = filtrosAUrl({ ...FILTROS_VACIOS, texto: ' web ', tipo: 'VACANTE' })
    expect(params.get('q')).toBe('web')
    expect(params.get('tipo')).toBe('VACANTE')
    expect(params.has('ciudad')).toBe(false)
  })

  it('al escribir y volver a leer se obtienen los mismos filtros', () => {
    const filtros = { texto: 'datos', tipo: 'PASANTIA', modalidad: 'HIBRIDA', ciudad: 'Valledupar', carreraId: '2' } as const
    expect(filtrosDesdeUrl(filtrosAUrl(filtros))).toEqual(filtros)
  })
})