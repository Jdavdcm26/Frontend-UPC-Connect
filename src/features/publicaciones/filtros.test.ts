import { describe, expect, it } from 'vitest'
import {
  FILTROS_PUBLICACIONES_VACIOS,
  filtrosPublicacionesAUrl,
  filtrosPublicacionesDesdeUrl,
} from '@/features/publicaciones/filtros'

const ID_CATEGORIA = '00000000-0000-4000-8000-000000000010'

describe('filtrosPublicacionesDesdeUrl', () => {
  it('sin parámetros es el feed de la comunidad sin filtros', () => {
    expect(filtrosPublicacionesDesdeUrl(new URLSearchParams())).toEqual(FILTROS_PUBLICACIONES_VACIOS)
  })

  it('lee los filtros válidos', () => {
    const params = new URLSearchParams(`alcance=seguidos&tipo=SERVICIO&categoria=${ID_CATEGORIA}`)
    expect(filtrosPublicacionesDesdeUrl(params)).toEqual({ alcance: 'seguidos', tipo: 'SERVICIO', categoriaId: ID_CATEGORIA })
  })

  it('descarta valores inválidos', () => {
    const params = new URLSearchParams('alcance=todos&tipo=OTRO&categoria=3')
    expect(filtrosPublicacionesDesdeUrl(params)).toEqual(FILTROS_PUBLICACIONES_VACIOS)
  })
})

describe('filtrosPublicacionesAUrl', () => {
  it('no escribe los vacíos ni el alcance por defecto', () => {
    expect(filtrosPublicacionesAUrl(FILTROS_PUBLICACIONES_VACIOS).toString()).toBe('')
  })

  it('al escribir y volver a leer se obtienen los mismos filtros', () => {
    const filtros = { alcance: 'seguidos', tipo: 'BUSQUEDA_EQUIPO', categoriaId: ID_CATEGORIA } as const
    expect(filtrosPublicacionesDesdeUrl(filtrosPublicacionesAUrl(filtros))).toEqual(filtros)
  })
})
