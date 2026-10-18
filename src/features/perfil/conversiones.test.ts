import { describe, expect, it } from 'vitest'
import {
  cuerpoPerfil,
  datosAPerfil,
  perfilAFormulario,
  perfilDesdeServidor,
  type PerfilServidor,
} from '@/features/perfil/conversiones'

// Los ids de carrera del servidor son UUID.
const ID_CARRERA = '00000000-0000-4000-8000-000000000003'

const datosEstudiante = {
  nombres: 'Ana',
  apellidos: 'Pérez',
  titular: '',
  descripcion: '',
  carreraId: ID_CARRERA,
  semestre: '6',
  anioGrado: '',
  ciudad: '',
  intereses: [],
}

// Respuesta de GET /api/v1/me/perfil tal como la arma PerfilResource (sin la clave data).
const perfilServidor: PerfilServidor = {
  nombres: 'Ana',
  apellidos: 'Pérez',
  titular: null,
  descripcion: null,
  carrera: { id: ID_CARRERA, nombre: 'Derecho', facultad: 'Ciencias Jurídicas' },
  semestre: 6,
  anio_grado: null,
  ciudad: null,
  intereses: ['IA'],
}

describe('conversiones del perfil', () => {
  it('sin perfil devuelve un formulario vacío', () => {
    const formulario = perfilAFormulario(null)
    expect(formulario.carreraId).toBe('')
    expect(formulario.semestre).toBe('')
    expect(formulario.intereses).toEqual([])
  })

  it('un estudiante lleva semestre y no año de grado', () => {
    const perfil = datosAPerfil(datosEstudiante, false, 'Derecho')
    expect(perfil.carreraId).toBe(ID_CARRERA)
    expect(perfil.carreraNombre).toBe('Derecho')
    expect(perfil.semestre).toBe(6)
    expect(perfil.anioGrado).toBeNull()
  })

  it('un egresado lleva año de grado y no semestre', () => {
    const perfil = datosAPerfil({ ...datosEstudiante, semestre: '', anioGrado: '2025' }, true, 'Derecho')
    expect(perfil.semestre).toBeNull()
    expect(perfil.anioGrado).toBe(2025)
  })

  it('ida y vuelta conserva los datos', () => {
    const estudiante = datosAPerfil(datosEstudiante, false, 'Derecho')
    expect(datosAPerfil(perfilAFormulario(estudiante), false, 'Derecho')).toEqual(estudiante)
    const egresado = datosAPerfil({ ...datosEstudiante, semestre: '', anioGrado: '2025' }, true, 'Derecho')
    expect(datosAPerfil(perfilAFormulario(egresado), true, 'Derecho')).toEqual(egresado)
  })
})

describe('perfil del servidor', () => {
  it('toma el id y el nombre de la carrera del objeto carrera', () => {
    const perfil = perfilDesdeServidor(perfilServidor)
    expect(perfil.carreraId).toBe(ID_CARRERA)
    expect(perfil.carreraNombre).toBe('Derecho')
  })

  it('cambia los textos nulos por texto vacío', () => {
    const perfil = perfilDesdeServidor(perfilServidor)
    expect(perfil.titular).toBe('')
    expect(perfil.descripcion).toBe('')
    expect(perfil.ciudad).toBe('')
  })

  it('un egresado llega sin semestre', () => {
    const perfil = perfilDesdeServidor({ ...perfilServidor, semestre: null, anio_grado: 2024 })
    expect(perfil.semestre).toBeNull()
    expect(perfil.anioGrado).toBe(2024)
  })
})

describe('cuerpo del PUT del perfil', () => {
  it('un estudiante envía semestre y no anio_grado', () => {
    const cuerpo = cuerpoPerfil(datosAPerfil(datosEstudiante, false, ''))
    expect(cuerpo).toMatchObject({ carrera_id: ID_CARRERA, semestre: 6 })
    expect(cuerpo).not.toHaveProperty('anio_grado')
  })

  it('un egresado envía anio_grado y no semestre', () => {
    const cuerpo = cuerpoPerfil(datosAPerfil({ ...datosEstudiante, semestre: '', anioGrado: '2025' }, true, ''))
    expect(cuerpo).toMatchObject({ anio_grado: 2025 })
    expect(cuerpo).not.toHaveProperty('semestre')
  })
})