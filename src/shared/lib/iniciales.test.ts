import { describe, expect, it } from 'vitest'
import { iniciales, inicialesDeNombre } from '@/shared/lib/iniciales'

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


describe('inicialesDeNombre', () => {
  it('usa la inicial del primer nombre y del primer apellido', () => {
    expect(inicialesDeNombre('Ana María', 'Pérez Gómez')).toBe('AP')
    expect(inicialesDeNombre('  ángel ', ' ñoño')).toBe('ÁÑ')
  })

  it('funciona con solo una de las dos partes', () => {
    expect(inicialesDeNombre('Ana', '')).toBe('A')
    expect(inicialesDeNombre('', 'Pérez')).toBe('P')
  })

  it('devuelve un signo de interrogación si no hay nombre', () => {
    expect(inicialesDeNombre('', '  ')).toBe('?')
  })
})
