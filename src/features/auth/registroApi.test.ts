import { describe, expect, it } from 'vitest'
import { traducirCampos } from '@/features/auth/registroApi'

describe('traducirCampos', () => {
  it('pasa los nombres del servidor a los del formulario', () => {
    const traducidos = traducirCampos({ email: ['Correo inválido.'], password: ['Muy corta.'] })
    expect(traducidos).toEqual({ correo: ['Correo inválido.'], contrasena: ['Muy corta.'] })
  })

  it('el aviso de que la política cambió se muestra en la casilla de aceptación', () => {
    const aviso = 'La política de tratamiento de datos cambió. Recarga la página, revísala y acéptala de nuevo.'
    expect(traducirCampos({ version_politica: [aviso] })).toEqual({ aceptaPolitica: [aviso] })
  })

  it('si llegan los dos avisos de la casilla, se muestran juntos', () => {
    const resultado = traducirCampos({ acepta_politica: ['Debes aceptar.'], version_politica: ['Cambió la política.'] })
    expect(resultado).toEqual({ aceptaPolitica: ['Debes aceptar.', 'Cambió la política.'] })
  })

  it('un campo desconocido se deja con su nombre', () => {
    expect(traducirCampos({ captcha: ['Verificación fallida.'] })).toEqual({ captcha: ['Verificación fallida.'] })
  })
})
