// Límites de las publicaciones y comentarios (HU-18 a HU-21, HU-26).
// Valores de GuardarPublicacionRequest, AgregarImagenesRequest y GuardarComentarioRequest del backend.
export const LIMITES_PUBLICACION = {
  contenido: 3000,
  comentario: 1000,
  area: 100,
  disponibilidad: 150,
  proyecto: 150,
  perfilesRequeridos: 500,
  cuposMinimo: 1,
  cuposMaximo: 20,
  imagenes: 4,
  // 5 MB por imagen.
  bytesImagen: 5 * 1024 * 1024,
} as const

// Formatos de imagen que acepta el servidor (jpg, jpeg, png y webp).
export const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp'] as const

// Valor del atributo accept del selector de archivos.
export const ACEPTA_IMAGENES = '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp'
