import { describe, expect, it } from 'vitest'
import { tituloDeRuta } from '@/app/titulos'

describe('tituloDeRuta', () => {
  it('la raíz solo lleva el nombre de la app', () => {
    expect(tituloDeRuta('/')).toBe('UPC Connect')
  })

  it('cada pantalla lleva su nombre antes del nombre de la app', () => {
    expect(tituloDeRuta('/perfil')).toBe('Mi perfil · UPC Connect')
    expect(tituloDeRuta('/perfil/editar')).toBe('Editar perfil · UPC Connect')
    expect(tituloDeRuta('/empresa/vacantes/nueva')).toBe('Publicar vacante · UPC Connect')
  })

  it('las rutas con un identificador también tienen título', () => {
    expect(tituloDeRuta('/vacantes/abc-123')).toBe('Detalle de la vacante · UPC Connect')
    expect(tituloDeRuta('/perfiles/ana-perez')).toBe('Perfil · UPC Connect')
    expect(tituloDeRuta('/empresa/vacantes/abc-123/postulaciones')).toBe('Postulaciones recibidas · UPC Connect')
    expect(tituloDeRuta('/empresa/vacantes/abc-123/editar')).toBe('Editar vacante · UPC Connect')
  })

  it('una barra final no cambia el título', () => {
    expect(tituloDeRuta('/vacantes/')).toBe('Vacantes · UPC Connect')
  })

  it('una ruta que no existe es «Página no encontrada»', () => {
    expect(tituloDeRuta('/no-existe')).toBe('Página no encontrada · UPC Connect')
    expect(tituloDeRuta('/vacantes/abc/otra/cosa')).toBe('Página no encontrada · UPC Connect')
  })
})
