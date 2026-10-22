import { LIMITES_PUBLICACION, TIPOS_IMAGEN } from '@/features/publicaciones/limites'

// Revisa una imagen antes de enviarla, con las mismas reglas del servidor (formato y tamaño).
// Devuelve el motivo del rechazo o null si la imagen sirve.
export function problemaDeImagen(archivo: Pick<File, 'name' | 'type' | 'size'>): string | null {
  if (!(TIPOS_IMAGEN as readonly string[]).includes(archivo.type)) {
    return `«${archivo.name}» no es una imagen JPG, PNG o WebP.`
  }
  if (archivo.size > LIMITES_PUBLICACION.bytesImagen) {
    return `«${archivo.name}» pesa más de 5 MB.`
  }
  return null
}

// Cuántas imágenes nuevas caben: entre las que ya hay y las nuevas, como máximo cuatro.
export function cuposDeImagen(actuales: number): number {
  return Math.max(0, LIMITES_PUBLICACION.imagenes - actuales)
}

// Separa las imágenes elegidas en las que se aceptan y los motivos de las que no.
// Las que no caben por el máximo se descartan con su aviso.
export function filtrarImagenes<T extends Pick<File, 'name' | 'type' | 'size'>>(
  elegidas: T[],
  actuales: number,
): { aceptadas: T[]; problemas: string[] } {
  const aceptadas: T[] = []
  const problemas: string[] = []
  const cupos = cuposDeImagen(actuales)
  for (const archivo of elegidas) {
    const problema = problemaDeImagen(archivo)
    if (problema) {
      problemas.push(problema)
    } else if (aceptadas.length < cupos) {
      aceptadas.push(archivo)
    }
  }
  const validas = elegidas.length - problemas.length
  if (validas > aceptadas.length) {
    problemas.push(`Una publicación tiene como máximo ${LIMITES_PUBLICACION.imagenes} imágenes.`)
  }
  return { aceptadas, problemas }
}
