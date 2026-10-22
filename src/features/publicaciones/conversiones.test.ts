import { describe, expect, it } from 'vitest'
import {
  alternarReaccion,
  comentarioDesdeServidor,
  cuerpoEditarPublicacion,
  cuerpoNuevaPublicacion,
  formularioNuevaPublicacion,
  publicacionAFormulario,
  publicacionDesdeServidor,
  traducirCamposPublicacion,
  type PublicacionServidor,
} from '@/features/publicaciones/conversiones'
import type { PublicacionDatos } from '@/features/publicaciones/publicacionEsquema'

const ID_CATEGORIA = '00000000-0000-4000-8000-000000000010'

// Publicación como la envía PublicacionResource.
const base: PublicacionServidor = {
  id: 'p-1',
  tipo: 'GENERAL',
  categoria: { id: ID_CATEGORIA, nombre: 'Logro' },
  contenido: 'Terminé mi práctica.',
  detalles: null,
  abierta: null,
  estado: 'VISIBLE',
  imagenes: [{ id: 'i-1', url: 'https://ejemplo.com/a.jpg' }],
  autor: { id: 'u-1', nombres: 'Ana', apellidos: 'Pérez', titular: null, slug: 'ana-perez', carrera: 'Derecho' },
  reacciones: 3,
  comentarios: 1,
  reaccione: true,
  es_mia: false,
  editada_en: null,
  creada_en: '2026-10-22T15:00:00Z',
}

const datosBase: PublicacionDatos = {
  tipo: 'GENERAL',
  categoriaId: ID_CATEGORIA,
  contenido: '  Hola comunidad  ',
  area: '',
  modalidad: '',
  disponibilidad: '',
  proyecto: '',
  perfilesRequeridos: '',
  cupos: '',
}

describe('publicacionDesdeServidor', () => {
  it('pasa los nombres a camelCase y arma el nombre del autor', () => {
    const p = publicacionDesdeServidor(base)
    expect(p.esMia).toBe(false)
    expect(p.creadaEn).toBe('2026-10-22T15:00:00Z')
    expect(p.autor.nombreCompleto).toBe('Ana Pérez')
    expect(p.autor.titular).toBe('')
    expect(p.oculta).toBe(false)
  })

  it('un autor sin perfil llega con un nombre genérico y sin enlace', () => {
    const p = publicacionDesdeServidor({
      ...base,
      autor: { id: 'u-2', nombres: null, apellidos: null, titular: null, slug: null, carrera: null },
    })
    expect(p.autor.nombreCompleto).toBe('Persona de la comunidad')
    expect(p.autor.slug).toBeNull()
  })

  it('lee la plantilla de un servicio', () => {
    const p = publicacionDesdeServidor({
      ...base,
      tipo: 'SERVICIO',
      abierta: true,
      detalles: { area: 'Matemáticas', modalidad: 'REMOTA', disponibilidad: 'Tardes' },
    })
    expect(p.detalles).toEqual({ tipo: 'SERVICIO', area: 'Matemáticas', modalidad: 'REMOTA', disponibilidad: 'Tardes' })
    expect(p.abierta).toBe(true)
  })

  it('lee la plantilla de una búsqueda de equipo', () => {
    const p = publicacionDesdeServidor({
      ...base,
      tipo: 'BUSQUEDA_EQUIPO',
      abierta: false,
      detalles: { proyecto: 'App', perfiles_requeridos: 'Diseño', cupos: 2 },
    })
    expect(p.detalles).toEqual({ tipo: 'BUSQUEDA_EQUIPO', proyecto: 'App', perfilesRequeridos: 'Diseño', cupos: 2 })
    expect(p.abierta).toBe(false)
  })

  it('una publicación oculta por moderación llega marcada', () => {
    expect(publicacionDesdeServidor({ ...base, estado: 'OCULTO' }).oculta).toBe(true)
  })
})

describe('comentarioDesdeServidor', () => {
  it('pasa los nombres a camelCase', () => {
    const c = comentarioDesdeServidor({
      id: 'c-1',
      contenido: 'Felicitaciones',
      autor: base.autor,
      es_mio: true,
      editado_en: '2026-10-22T16:00:00Z',
      creado_en: '2026-10-22T15:30:00Z',
    })
    expect(c.esMio).toBe(true)
    expect(c.editadoEn).toBe('2026-10-22T16:00:00Z')
    expect(c.autor.slug).toBe('ana-perez')
  })
})

describe('cuerpos para el servidor', () => {
  it('una publicación general no lleva detalles y el contenido va sin espacios sobrantes', () => {
    expect(cuerpoNuevaPublicacion(datosBase)).toEqual({ tipo: 'GENERAL', categoria_id: ID_CATEGORIA, contenido: 'Hola comunidad' })
  })

  it('una búsqueda de equipo envía sus detalles con los cupos como número', () => {
    const cuerpo = cuerpoEditarPublicacion({
      ...datosBase,
      tipo: 'BUSQUEDA_EQUIPO',
      proyecto: 'App',
      perfilesRequeridos: 'Diseño',
      cupos: '3',
      area: 'no se envía',
    })
    expect(cuerpo).toEqual({
      categoria_id: ID_CATEGORIA,
      contenido: 'Hola comunidad',
      detalles: { proyecto: 'App', perfiles_requeridos: 'Diseño', cupos: 3 },
    })
    expect(cuerpo).not.toHaveProperty('tipo')
  })

  it('con imágenes arma un multipart con detalles[campo] e imagenes[]', () => {
    const imagen = new File(['x'], 'a.png', { type: 'image/png' })
    const formulario = formularioNuevaPublicacion(
      { ...datosBase, tipo: 'SERVICIO', area: 'Cálculo', modalidad: 'PRESENCIAL', disponibilidad: 'Lunes' },
      [imagen, imagen],
    )
    expect(formulario.get('tipo')).toBe('SERVICIO')
    expect(formulario.get('detalles[area]')).toBe('Cálculo')
    expect(formulario.get('detalles[modalidad]')).toBe('PRESENCIAL')
    expect(formulario.getAll('imagenes[]')).toHaveLength(2)
  })

  it('al editar, el formulario arranca con los datos de la publicación', () => {
    const p = publicacionDesdeServidor({
      ...base,
      tipo: 'BUSQUEDA_EQUIPO',
      detalles: { proyecto: 'App', perfiles_requeridos: 'Diseño', cupos: 2 },
    })
    expect(publicacionAFormulario(p)).toEqual({
      ...datosBase,
      tipo: 'BUSQUEDA_EQUIPO',
      contenido: 'Terminé mi práctica.',
      proyecto: 'App',
      perfilesRequeridos: 'Diseño',
      cupos: '2',
    })
  })
})

describe('traducirCamposPublicacion', () => {
  it('pasa los campos del servidor a los del formulario y junta los de las imágenes', () => {
    expect(
      traducirCamposPublicacion({
        categoria_id: ['Elige una categoría activa.'],
        'detalles.perfiles_requeridos': ['Falta.'],
        imagenes: ['Máximo 4.'],
        'imagenes.1': ['No es imagen.'],
        contenido: ['Muy largo.'],
      }),
    ).toEqual({
      categoriaId: ['Elige una categoría activa.'],
      perfilesRequeridos: ['Falta.'],
      imagenes: ['Máximo 4.', 'No es imagen.'],
      contenido: ['Muy largo.'],
    })
  })
})

describe('alternarReaccion', () => {
  it('suma al reaccionar y resta al quitar la reacción', () => {
    expect(alternarReaccion({ reacciones: 2, reaccione: false })).toEqual({ reacciones: 3, reaccione: true })
    expect(alternarReaccion({ reacciones: 3, reaccione: true })).toEqual({ reacciones: 2, reaccione: false })
  })

  it('nunca baja de cero', () => {
    expect(alternarReaccion({ reacciones: 0, reaccione: true })).toEqual({ reacciones: 0, reaccione: false })
  })
})
