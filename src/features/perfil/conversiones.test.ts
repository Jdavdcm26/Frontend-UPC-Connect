import { describe, expect, it } from 'vitest'
import { datosAPerfil, perfilAFormulario } from '@/features/perfil/conversiones'

// Los ids de carrera del servidor son UUID.
const ID_CARRERA = '00000000-0000-4000-8000-000000000003'

describe('conversiones del perfil', () => {
  it('sin perfil devuelve un formulario vacío', () => {
    const formulario = perfilAFormulario(null)
    expect(formulario.carreraId).toBe('')
    expect(formulario.semestre).toBe('')
    expect(formulario.intereses).toEqual([])
  })

  it('convierte el texto del formulario en números y conserva la carrera', () => {
    const perfil = datosAPerfil({
      nombres: 'Ana',
      apellidos: 'Pérez',
      titular: '',
      descripcion: '',
      carreraId: ID_CARRERA,
      semestre: '6',
      anioGrado: '',
      ciudad: '',
      intereses: [],
    })
    expect(perfil.carreraId).toBe(ID_CARRERA)
    expect(perfil.semestre).toBe(6)
    expect(perfil.anioGrado).toBeNull()
  })

  it('ida y vuelta conserva los datos', () => {
    const perfil = {
      nombres: 'Luis',
      apellidos: 'Gómez',
      titular: 'Egresado',
      descripcion: 'Hola',
      carreraId: ID_CARRERA,
      semestre: 10,
      anioGrado: 2025,
      ciudad: 'Valledupar',
      intereses: ['IA'],
    }
    expect(datosAPerfil(perfilAFormulario(perfil))).toEqual(perfil)
  })
})