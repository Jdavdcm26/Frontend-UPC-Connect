import { describe, expect, it } from 'vitest'
import { cuposDeImagen, filtrarImagenes, problemaDeImagen } from '@/features/publicaciones/imagenes'

const MB = 1024 * 1024
const imagen = (name: string, type = 'image/png', size = MB) => ({ name, type, size })

describe('problemaDeImagen', () => {
  it('acepta JPG, PNG y WebP de hasta 5 MB', () => {
    expect(problemaDeImagen(imagen('a.jpg', 'image/jpeg'))).toBeNull()
    expect(problemaDeImagen(imagen('a.webp', 'image/webp', 5 * MB))).toBeNull()
  })

  it('rechaza otros formatos y las de más de 5 MB', () => {
    expect(problemaDeImagen(imagen('a.gif', 'image/gif'))).toBe('«a.gif» no es una imagen JPG, PNG o WebP.')
    expect(problemaDeImagen(imagen('b.png', 'image/png', 5 * MB + 1))).toBe('«b.png» pesa más de 5 MB.')
  })
})

describe('filtrarImagenes', () => {
  it('quedan las que caben hasta completar cuatro', () => {
    expect(cuposDeImagen(3)).toBe(1)
    const { aceptadas, problemas } = filtrarImagenes([imagen('a.png'), imagen('b.png')], 3)
    expect(aceptadas.map((a) => a.name)).toEqual(['a.png'])
    expect(problemas).toEqual(['Una publicación tiene como máximo 4 imágenes.'])
  })

  it('separa las que no sirven y explica por qué', () => {
    const { aceptadas, problemas } = filtrarImagenes([imagen('a.png'), imagen('b.pdf', 'application/pdf')], 0)
    expect(aceptadas.map((a) => a.name)).toEqual(['a.png'])
    expect(problemas).toEqual(['«b.pdf» no es una imagen JPG, PNG o WebP.'])
  })
})
