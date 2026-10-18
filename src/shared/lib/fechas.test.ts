import { describe, expect, it } from 'vitest'
import { hoyLocal } from '@/shared/lib/fechas'

describe('hoyLocal', () => {
  it('devuelve la fecha con formato AAAA-MM-DD', () => {
    expect(hoyLocal()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})