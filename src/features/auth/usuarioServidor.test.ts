import { describe, expect, it } from 'vitest'
import { usuarioDesdeServidor } from '@/features/auth/usuarioServidor'

const base = { id: '7', name: 'Ana Pérez', email: 'ana@unicesar.edu.co', rol: 'ESTUDIANTE', estado: 'ACTIVO' }

describe('usuarioDesdeServidor', () => {
  it('traduce un estudiante activo', () => {
    expect(usuarioDesdeServidor(base)).toEqual({
      id: '7',
      correo: 'ana@unicesar.edu.co',
      rol: 'candidato',
      esEgresado: false,
      estado: 'ACTIVO',
    })
  })

  it('marca a un egresado como candidato egresado', () => {
    const usuario = usuarioDesdeServidor({ ...base, rol: 'EGRESADO' })
    expect(usuario.rol).toBe('candidato')
    expect(usuario.esEgresado).toBe(true)
  })

  it('traduce una empresa', () => {
    const usuario = usuarioDesdeServidor({ ...base, rol: 'EMPRESA' })
    expect(usuario.rol).toBe('empresa')
    expect(usuario.esEgresado).toBe(false)
  })

  it('una empresa sin aprobar queda marcada', () => {
    const usuario = usuarioDesdeServidor({ ...base, rol: 'EMPRESA', empresa_aprobada: false })
    expect(usuario.empresaAprobada).toBe(false)
  })

  it('una empresa aprobada queda marcada', () => {
    expect(usuarioDesdeServidor({ ...base, rol: 'EMPRESA', empresa_aprobada: true }).empresaAprobada).toBe(true)
  })

  it('un candidato no lleva dato de aprobación', () => {
    expect(usuarioDesdeServidor({ ...base, empresa_aprobada: false })).not.toHaveProperty('empresaAprobada')
  })

  it('acepta mayúsculas o minúsculas', () => {
    const usuario = usuarioDesdeServidor({ ...base, rol: 'empresa', estado: 'suspendido' })
    expect(usuario.rol).toBe('empresa')
    expect(usuario.estado).toBe('SUSPENDIDO')
  })

  it('un estado desconocido queda PENDIENTE', () => {
    expect(usuarioDesdeServidor({ ...base, estado: 'RARO' }).estado).toBe('PENDIENTE')
  })
})