import { describe, expect, it } from 'vitest'
import { postulacionDesdeServidor, type PostulacionServidor } from '@/features/postulaciones/postulacionesApi'
import {
  detalleDesdeServidor,
  recibidaDesdeServidor,
  type DetalleServidor,
  type RecibidaServidor,
} from '@/features/postulaciones/postulacionesEmpresaApi'

// Respuestas como las envía el backend (contrato de José): las fechas llegan en «creada_en» y «cambiado_en».

const mia: PostulacionServidor = {
  id: 'p-1',
  estado: 'EN_REVISION',
  mensaje: null,
  creada_en: '2026-10-01T15:00:00Z',
  actualizada_en: '2026-10-02T09:30:00Z',
  vacante: {
    id: 'v-1',
    titulo: 'Desarrollador web junior',
    abierta: true,
    empresa: { id: 7, razon_social: 'Acme S.A.S.' },
  },
}

const recibida: RecibidaServidor = {
  id: 'p-2',
  estado: 'RECIBIDA',
  creada_en: '2026-10-03T10:00:00Z',
  candidato: {
    nombres: 'Ana',
    apellidos: 'Pérez',
    titular: null,
    descripcion: null,
    carrera: { id: 'c-1', nombre: 'Ingeniería de Sistemas' },
    semestre: 8,
    anio_grado: null,
    ciudad: null,
    intereses: [],
  },
}

const detalle: DetalleServidor = {
  ...recibida,
  mensaje: 'Me interesa mucho.',
  historial: [
    { estado: 'EN_REVISION', cambiado_en: '2026-10-04T08:00:00Z', responsable: 'Mi Empresa' },
    { estado: 'RECIBIDA', cambiado_en: '2026-10-03T10:00:00Z', responsable: 'Sistema' },
  ],
}

describe('postulacionDesdeServidor', () => {
  it('toma la fecha de «creada_en» y el nombre de la empresa', () => {
    const resultado = postulacionDesdeServidor(mia)
    expect(resultado.creadaEn).toBe('2026-10-01T15:00:00Z')
    expect(resultado.empresa).toBe('Acme S.A.S.')
    expect(resultado.vacanteId).toBe('v-1')
  })

  it('un mensaje nulo queda como cadena vacía', () => {
    expect(postulacionDesdeServidor(mia).mensaje).toBe('')
  })
})

describe('recibidaDesdeServidor', () => {
  it('arma la fila con el nombre completo y la carrera', () => {
    expect(recibidaDesdeServidor(recibida)).toEqual({
      id: 'p-2',
      estado: 'RECIBIDA',
      creadaEn: '2026-10-03T10:00:00Z',
      nombre: 'Ana Pérez',
      carrera: 'Ingeniería de Sistemas',
      semestre: 8,
      anioGrado: null,
    })
  })
})

describe('detalleDesdeServidor', () => {
  it('toma las fechas del historial de «cambiado_en» y deja el responsable como texto', () => {
    const resultado = detalleDesdeServidor(detalle)
    expect(resultado.creadaEn).toBe('2026-10-03T10:00:00Z')
    expect(resultado.historial).toEqual([
      { estado: 'EN_REVISION', fecha: '2026-10-04T08:00:00Z', responsable: 'Mi Empresa' },
      { estado: 'RECIBIDA', fecha: '2026-10-03T10:00:00Z', responsable: 'Sistema' },
    ])
  })

  it('los datos del candidato que llegan nulos quedan como cadenas vacías', () => {
    const { candidato } = detalleDesdeServidor(detalle)
    expect(candidato.titular).toBe('')
    expect(candidato.descripcion).toBe('')
    expect(candidato.ciudad).toBe('')
    expect(candidato.carrera).toBe('Ingeniería de Sistemas')
  })
})
