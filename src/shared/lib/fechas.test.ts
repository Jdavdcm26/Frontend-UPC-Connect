import { describe, expect, it } from 'vitest'
import { formatearDia, formatearFecha, formatearFechaHora, formatearHace, hoyLocal } from '@/shared/lib/fechas'

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

describe('formatearHace', () => {
  const ahora = new Date('2026-10-22T15:00:00Z')

  it('lo de menos de un minuto es «hace un momento», aunque venga un poco en el futuro', () => {
    expect(formatearHace('2026-10-22T14:59:30Z', ahora)).toBe('hace un momento')
    expect(formatearHace('2026-10-22T15:00:20Z', ahora)).toBe('hace un momento')
  })

  it('cuenta minutos, horas y días en singular y plural', () => {
    expect(formatearHace('2026-10-22T14:59:00Z', ahora)).toBe('hace 1 minuto')
    expect(formatearHace('2026-10-22T14:15:00Z', ahora)).toBe('hace 45 minutos')
    expect(formatearHace('2026-10-22T14:00:00Z', ahora)).toBe('hace 1 hora')
    expect(formatearHace('2026-10-22T05:00:00Z', ahora)).toBe('hace 10 horas')
    expect(formatearHace('2026-10-21T15:00:00Z', ahora)).toBe('hace 1 día')
    expect(formatearHace('2026-10-17T15:00:00Z', ahora)).toBe('hace 5 días')
  })

  it('pasada una semana muestra la fecha', () => {
    expect(formatearHace('2026-10-01T12:00:00Z', ahora)).toBe('1 de octubre de 2026')
  })
})
