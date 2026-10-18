import { describe, expect, it } from 'vitest'
import { destinoPermitido, rutaInicioPorRol } from '@/features/auth/rutaPorRol'
import { usuarioDesdeServidor } from '@/features/auth/usuarioServidor'
import { RUTAS } from '@/shared/lib/rutas'

const base = { id: '1', name: 'Alguien', email: 'alguien@correo.com', estado: 'ACTIVO' }

describe('roles administrativos', () => {
  it('traduce ADMIN y MODERADOR desde el servidor', () => {
    expect(usuarioDesdeServidor({ ...base, rol: 'ADMIN' }).rol).toBe('admin')
    expect(usuarioDesdeServidor({ ...base, rol: 'MODERADOR' }).rol).toBe('moderador')
  })

  it('sigue tratando estudiantes y egresados como candidatos, y empresa como empresa', () => {
    expect(usuarioDesdeServidor({ ...base, rol: 'ESTUDIANTE' }).rol).toBe('candidato')
    expect(usuarioDesdeServidor({ ...base, rol: 'EGRESADO' }).rol).toBe('candidato')
    expect(usuarioDesdeServidor({ ...base, rol: 'EMPRESA' }).rol).toBe('empresa')
  })

  it('manda a admin y moderador a la pantalla de cuenta administrativa', () => {
    expect(rutaInicioPorRol('admin')).toBe(RUTAS.cuentaAdministrativa)
    expect(rutaInicioPorRol('moderador')).toBe(RUTAS.cuentaAdministrativa)
  })

  it('no los devuelve a rutas de candidato ni de empresa', () => {
    expect(destinoPermitido('/inicio', 'admin')).toBeNull()
    expect(destinoPermitido('/vacantes?q=web', 'admin')).toBeNull()
    expect(destinoPermitido('/empresa/vacantes', 'moderador')).toBeNull()
  })

  it('/vacantes es solo de candidatos', () => {
    expect(destinoPermitido('/vacantes?q=web', 'candidato')).toBe('/vacantes?q=web')
    expect(destinoPermitido('/vacantes/abc', 'empresa')).toBeNull()
  })
})