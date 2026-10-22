import { describe, expect, it } from 'vitest'
import { comentarioEsquema, publicacionEsquema, type PublicacionDatos } from '@/features/publicaciones/publicacionEsquema'

const general: PublicacionDatos = {
  tipo: 'GENERAL',
  categoriaId: 'c-1',
  contenido: 'Hola',
  area: '',
  modalidad: '',
  disponibilidad: '',
  proyecto: '',
  perfilesRequeridos: '',
  cupos: '',
}

// Campos con error de un intento de validación.
const camposConError = (datos: unknown) => {
  const resultado = publicacionEsquema.safeParse(datos)
  return resultado.success ? [] : resultado.error.issues.map((i) => i.path.join('.'))
}

describe('publicacionEsquema', () => {
  it('una publicación general no exige la plantilla', () => {
    expect(camposConError(general)).toEqual([])
  })

  it('exige tipo, categoría y contenido', () => {
    expect(camposConError({ ...general, tipo: '', categoriaId: '', contenido: '   ' })).toEqual(['tipo', 'categoriaId', 'contenido'])
  })

  it('un servicio exige área, modalidad y disponibilidad', () => {
    expect(camposConError({ ...general, tipo: 'SERVICIO' }).sort()).toEqual(['area', 'disponibilidad', 'modalidad'])
    expect(camposConError({ ...general, tipo: 'SERVICIO', area: 'Física', modalidad: 'HIBRIDA', disponibilidad: 'Sábados' })).toEqual([])
  })

  it('una búsqueda de equipo exige proyecto, perfiles y cupos entre 1 y 20', () => {
    const equipo = { ...general, tipo: 'BUSQUEDA_EQUIPO', proyecto: 'App', perfilesRequeridos: 'Diseño' }
    expect(camposConError({ ...equipo, cupos: '' })).toEqual(['cupos'])
    expect(camposConError({ ...equipo, cupos: '21' })).toEqual(['cupos'])
    expect(camposConError({ ...equipo, cupos: '1.5' })).toEqual(['cupos'])
    expect(camposConError({ ...equipo, cupos: '20' })).toEqual([])
  })

  it('el contenido admite máximo 3000 caracteres', () => {
    expect(camposConError({ ...general, contenido: 'a'.repeat(3001) })).toEqual(['contenido'])
  })
})

describe('comentarioEsquema', () => {
  it('exige texto y admite máximo 1000 caracteres', () => {
    expect(comentarioEsquema.safeParse({ contenido: '  ' }).success).toBe(false)
    expect(comentarioEsquema.safeParse({ contenido: 'a'.repeat(1001) }).success).toBe(false)
    expect(comentarioEsquema.safeParse({ contenido: 'Bien' }).success).toBe(true)
  })
})
