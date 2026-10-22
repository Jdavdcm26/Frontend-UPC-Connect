import { ALCANCES, TIPOS_PUBLICACION, type Alcance, type TipoPublicacion } from '@/features/publicaciones/tipos'

// Filtros del feed. Viajan en la URL para poder compartirlos y volver con «atrás».
export type FiltrosPublicaciones = {
  alcance: Alcance
  tipo: TipoPublicacion | ''
  categoriaId: string
}

export const FILTROS_PUBLICACIONES_VACIOS: FiltrosPublicaciones = {
  alcance: 'comunidad',
  tipo: '',
  categoriaId: '',
}

// Los ids de categoría del servidor son UUID.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Solo acepta valores válidos; cualquier otra cosa en la URL se descarta.
export function filtrosPublicacionesDesdeUrl(params: URLSearchParams): FiltrosPublicaciones {
  const categoria = params.get('categoria') ?? ''
  return {
    alcance: ALCANCES.find((a) => a === params.get('alcance')) ?? 'comunidad',
    tipo: TIPOS_PUBLICACION.find((t) => t === params.get('tipo')) ?? '',
    categoriaId: UUID.test(categoria) ? categoria : '',
  }
}

// Escribe los filtros como parámetros de URL, sin los vacíos ni el alcance por defecto.
export function filtrosPublicacionesAUrl(filtros: FiltrosPublicaciones): URLSearchParams {
  const params = new URLSearchParams()
  if (filtros.alcance !== 'comunidad') params.set('alcance', filtros.alcance)
  if (filtros.tipo) params.set('tipo', filtros.tipo)
  if (filtros.categoriaId) params.set('categoria', filtros.categoriaId)
  return params
}
