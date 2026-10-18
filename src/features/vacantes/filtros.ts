import {
  MODALIDADES,
  TIPOS_VACANTE,
  type Modalidad,
  type TipoVacante,
} from '@/features/vacantes/tipos'

// Filtros del listado de vacantes. Viajan en la URL para poder compartirlos.
export type FiltrosVacantes = {
  texto: string
  tipo: TipoVacante | ''
  modalidad: Modalidad | ''
  ciudad: string
  carreraId: string
}

export const FILTROS_VACIOS: FiltrosVacantes = {
  texto: '',
  tipo: '',
  modalidad: '',
  ciudad: '',
  carreraId: '',
}

// Los ids de carrera del servidor son UUID.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Solo acepta valores válidos; cualquier otra cosa en la URL se descarta.
function valorValido<T extends string>(valor: string | null, permitidos: readonly T[]): T | '' {
  return permitidos.find((p) => p === valor) ?? ''
}

// Lee los filtros desde los parámetros de la URL.
export function filtrosDesdeUrl(params: URLSearchParams): FiltrosVacantes {
  const carrera = params.get('carrera') ?? ''
  return {
    texto: (params.get('q') ?? '').trim(),
    tipo: valorValido(params.get('tipo'), TIPOS_VACANTE),
    modalidad: valorValido(params.get('modalidad'), MODALIDADES),
    ciudad: (params.get('ciudad') ?? '').trim(),
    carreraId: UUID.test(carrera) ? carrera : '',
  }
}

// Escribe los filtros como parámetros de URL, sin incluir los vacíos.
export function filtrosAUrl(filtros: FiltrosVacantes): URLSearchParams {
  const params = new URLSearchParams()
  if (filtros.texto.trim()) params.set('q', filtros.texto.trim())
  if (filtros.tipo) params.set('tipo', filtros.tipo)
  if (filtros.modalidad) params.set('modalidad', filtros.modalidad)
  if (filtros.ciudad.trim()) params.set('ciudad', filtros.ciudad.trim())
  if (filtros.carreraId) params.set('carrera', filtros.carreraId)
  return params
}