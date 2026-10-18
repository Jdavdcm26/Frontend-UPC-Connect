import { describe, expect, it } from 'vitest'
import { vacanteDesdeServidor, type VacanteServidor } from '@/features/vacantes/vacantesApi'

// Vacante como la envía el backend (contrato de José).
const base: VacanteServidor = {
  id: 'v-1',
  tipo: 'VACANTE',
  titulo: 'Desarrollador web junior',
  descripcion: 'Apoyo en el desarrollo de aplicaciones web.',
  requisitos: 'HTML, CSS y JavaScript.',
  ciudad: 'Valledupar',
  modalidad: 'HIBRIDA',
  estado: 'ACTIVA',
  fecha_cierre: '2026-12-31',
  abierta: true,
  empresa: { id: 7, razon_social: 'Acme S.A.S.' },
}

describe('vacanteDesdeServidor', () => {
  it('toma «abierta» tal como la manda el servidor', () => {
    expect(vacanteDesdeServidor(base).abierta).toBe(true)
  })

  it('una vacante ACTIVA con la fecha vencida llega cerrada a postulaciones', () => {
    const vencida = vacanteDesdeServidor({ ...base, fecha_cierre: '2020-01-01', abierta: false })
    expect(vencida.estado).toBe('ACTIVA')
    expect(vencida.abierta).toBe(false)
  })

  it('«ya_postulado» solo llega en el detalle; si falta es false', () => {
    expect(vacanteDesdeServidor(base).yaPostulado).toBe(false)
    expect(vacanteDesdeServidor({ ...base, ya_postulado: true }).yaPostulado).toBe(true)
  })
})
