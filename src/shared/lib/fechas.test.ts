import { describe, expect, it } from 'vitest'
import { formatearDia, formatearFecha, formatearFechaHora, hoyLocal } from '@/shared/lib/fechas'

describe('hoyLocal', () => {
  it('devuelve la fecha con formato AAAA-MM-DD', () => {
    expect(hoyLocal()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('formatearFecha', () => {
  it('escribe la fecha en español', () => {
    expect(formatearFecha('2026-10-17T12:00:00Z')).toBe('17 de octubre de 2026')
  })
})

describe('formatearFechaHora', () => {
  it('escribe la fecha y la hora en español', () => {
    // El separador entre la fecha y la hora cambia según la versión de Node («,» o «a las»).
    expect(formatearFechaHora('2026-10-17T12:00:00Z')).toMatch(/^17 de octubre de 2026.*\d{1,2}:\d{2}/)
  })
})

describe('formatearDia', () => {
  it('escribe el día en español sin correrlo por la zona horaria', () => {
    expect(formatearDia('2026-10-17')).toBe('17 de octubre de 2026')
    expect(formatearDia('2026-01-01')).toBe('1 de enero de 2026')
  })
})
