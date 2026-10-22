import { describe, expect, it } from 'vitest'
import {
  cuentaBloqueadaDesdeServidor,
  redPerfilDesdeServidor,
  redPropiaDesdeServidor,
  textoContador,
} from '@/features/red/conversiones'

describe('conversiones de la red', () => {
  it('pasa el bloque «red» del perfil a camelCase', () => {
    expect(
      redPerfilDesdeServidor({ usuario_id: 'u-1', seguidores: 4, seguidos: 2, lo_sigues: true, lo_bloqueaste: false }),
    ).toEqual({ usuarioId: 'u-1', seguidores: 4, seguidos: 2, loSigues: true, loBloqueaste: false })
  })

  it('sin el bloque del perfil propio los contadores quedan en cero', () => {
    expect(redPropiaDesdeServidor(undefined)).toEqual({ seguidores: 0, seguidos: 0 })
    expect(redPropiaDesdeServidor({ seguidores: 7, seguidos: 1 })).toEqual({ seguidores: 7, seguidos: 1 })
  })

  it('pasa una cuenta bloqueada a camelCase; una empresa llega sin slug', () => {
    expect(
      cuentaBloqueadaDesdeServidor({ id: 'u-2', nombre: 'Acme S.A.S.', rol: 'EMPRESA', slug: null, bloqueado_en: '2026-10-22T15:00:00Z' }),
    ).toEqual({ id: 'u-2', nombre: 'Acme S.A.S.', rol: 'EMPRESA', slug: null, bloqueadaEn: '2026-10-22T15:00:00Z' })
  })

  it('escribe los contadores en singular o plural', () => {
    expect(textoContador(1, 'seguidor', 'seguidores')).toBe('1 seguidor')
    expect(textoContador(0, 'seguidor', 'seguidores')).toBe('0 seguidores')
  })
})
