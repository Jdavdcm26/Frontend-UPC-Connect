import { describe, expect, it } from 'vitest'
import { destinoPermitido } from '@/features/auth/rutaPorRol'

describe('destinoPermitido', () => {
  it('sin ruta guardada devuelve null', () => {
    expect(destinoPermitido(null, 'candidato')).toBeNull()
  })

  it('el candidato vuelve a sus rutas', () => {
    expect(destinoPermitido('/inicio', 'candidato')).toBe('/inicio')
    expect(destinoPermitido('/perfil/editar', 'candidato')).toBe('/perfil/editar')
  })

  it('el candidato vuelve a Mis postulaciones y la empresa no', () => {
    expect(destinoPermitido('/mis-postulaciones', 'candidato')).toBe('/mis-postulaciones')
    expect(destinoPermitido('/mis-postulaciones', 'empresa')).toBeNull()
  })

  it('la empresa vuelve a /empresa', () => {
    expect(destinoPermitido('/empresa', 'empresa')).toBe('/empresa')
  })

  it('la empresa no vuelve a rutas de candidato', () => {
    expect(destinoPermitido('/inicio', 'empresa')).toBeNull()
    expect(destinoPermitido('/perfil', 'empresa')).toBeNull()
  })

  it('el candidato no vuelve a rutas de empresa', () => {
    expect(destinoPermitido('/empresa', 'candidato')).toBeNull()
  })

  it('las rutas públicas sirven para cualquier rol', () => {
    expect(destinoPermitido('/catalogo', 'empresa')).toBe('/catalogo')
    expect(destinoPermitido('/politica-de-privacidad', 'candidato')).toBe('/politica-de-privacidad')
  })
})