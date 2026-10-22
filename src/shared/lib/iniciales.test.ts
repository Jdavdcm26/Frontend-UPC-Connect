import { describe, expect, it } from 'vitest'
import { iniciales } from '@/shared/lib/iniciales'

describe('iniciales', () => {
  it('usa la inicial de las dos primeras partes del correo', () => {
    expect(iniciales('jose.castro@correo.com')).toBe('JC')
    expect(iniciales('maria_perez@correo.com')).toBe('MP')
    expect(iniciales('ana-lopez@correo.com')).toBe('AL')
  })

  it('con una sola parte usa las dos primeras letras', () => {
    expect(iniciales('ana@correo.com')).toBe('AN')
    expect(iniciales('x@correo.com')).toBe('X')
  })

  it('devuelve un signo de interrogación si no hay con qué armarlas', () => {
    expect(iniciales('')).toBe('?')
    expect(iniciales('@correo.com')).toBe('?')
    expect(iniciales('...@correo.com')).toBe('?')
  })
})
