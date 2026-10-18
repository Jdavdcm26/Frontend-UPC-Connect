import { obtenerSesion, USAR_FIXTURES } from '@/features/auth/sesionApi'
import { CLAVE_POSTULACIONES } from '@/features/postulaciones/postulacionesApi'
import {
  guardarPostulacionesDemo,
  leerPostulacionesDemo,
  type PostulacionDemo,
} from '@/features/postulaciones/postulacionesDemo'
import type {
  CambioEstado,
  CandidatoVisible,
  DetallePostulacionRecibida,
  EstadoPostulacion,
  PostulacionRecibida,
} from '@/features/postulaciones/tipos'
import { obtenerMiVacante, TAMANO_PAGINA } from '@/features/vacantes/vacantesApi'
import { ApiError } from '@/shared/api/apiError'
import { api } from '@/shared/api/client'

const pausa = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

// Claves de TanStack Query de la parte de la empresa (cuelgan de CLAVE_POSTULACIONES).
export const claveRecibidas = (vacanteId: string) => [...CLAVE_POSTULACIONES, 'recibidas', vacanteId] as const
export const claveDetalleRecibida = (id: string) => [...CLAVE_POSTULACIONES, 'detalle', id] as const

export type PaginaRecibidas = {
  postulaciones: PostulacionRecibida[]
  // Cursor de la página siguiente; null si no hay más.
  siguiente: string | null
}

// Formas de la API de la empresa (API-26, API-27 y API-28), según el contrato de José (BE-32 y BE-33).
// El candidato también trae «habilidades», que todavía no se muestra.
type CandidatoServidor = {
  // BE-32: el id y el slug (dirección de su perfil) llegan siempre.
  id: string
  slug: string
  nombres: string
  apellidos: string
  titular: string | null
  descripcion: string | null
  // null si la carrera ya no existe.
  carrera: { id: string; nombre: string } | null
  semestre: number | null
  anio_grado: number | null
  ciudad: string | null
  intereses: string[]
}

export type RecibidaServidor = {
  id: string
  estado: EstadoPostulacion
  creada_en: string
  // null si la persona ya no tiene perfil.
  candidato: CandidatoServidor | null
}

// «responsable» es el nombre de la cuenta que hizo el cambio; es null si esa cuenta ya no existe.
export type DetalleServidor = RecibidaServidor & {
  mensaje: string | null
  historial: { estado: EstadoPostulacion; cambiado_en: string; responsable: string | null }[]
}

// Qué se muestra cuando el servidor no envía el perfil del candidato.
const SIN_PERFIL = 'Perfil no disponible'

const CANDIDATO_SIN_PERFIL: CandidatoVisible = {
  // Sin perfil no hay dirección: la pantalla no ofrece el enlace.
  slug: '',
  nombres: SIN_PERFIL,
  apellidos: '',
  titular: '',
  descripcion: '',
  carrera: '',
  semestre: null,
  anioGrado: null,
  ciudad: '',
  intereses: [],
}

export function recibidaDesdeServidor(p: RecibidaServidor): PostulacionRecibida {
  const c = p.candidato
  return {
    id: p.id,
    estado: p.estado,
    creadaEn: p.creada_en,
    nombre: c ? `${c.nombres} ${c.apellidos}` : SIN_PERFIL,
    carrera: c?.carrera?.nombre ?? '',
    semestre: c?.semestre ?? null,
    anioGrado: c?.anio_grado ?? null,
  }
}

export function detalleDesdeServidor(p: DetalleServidor): DetallePostulacionRecibida {
  const c = p.candidato
  return {
    id: p.id,
    estado: p.estado,
    creadaEn: p.creada_en,
    mensaje: p.mensaje ?? '',
    candidato: c
      ? {
          slug: c.slug,
          nombres: c.nombres,
          apellidos: c.apellidos,
          titular: c.titular ?? '',
          descripcion: c.descripcion ?? '',
          carrera: c.carrera?.nombre ?? '',
          semestre: c.semestre,
          anioGrado: c.anio_grado,
          ciudad: c.ciudad ?? '',
          intereses: c.intereses,
        }
      : CANDIDATO_SIN_PERFIL,
    historial: p.historial.map((h) => ({
      estado: h.estado,
      fecha: h.cambiado_en,
      responsable: h.responsable ?? 'Sin responsable',
    })),
  }
}

// Con fixtures: la postulación debe existir y su vacante debe ser de la empresa con sesión.
// Si no, se responde 404, igual que haría el servidor con una vacante ajena.
async function buscarPropia(id: string): Promise<PostulacionDemo> {
  const postulacion = leerPostulacionesDemo().find((p) => p.id === id)
  if (!postulacion) throw new ApiError(404, 'No encontramos esa postulación.')
  await obtenerMiVacante(postulacion.vacanteId)
  return postulacion
}

function detalleDesdeDemo(p: PostulacionDemo): DetallePostulacionRecibida {
  const candidato: CandidatoVisible = p.candidato
  return {
    id: p.id,
    estado: p.estado,
    creadaEn: p.creadaEn,
    mensaje: p.mensaje,
    candidato,
    historial: p.historial,
  }
}

// Postulaciones recibidas por una vacante propia, de la más reciente a la más antigua, por cursor (API-26).
export async function listarPostulacionesRecibidas(vacanteId: string, cursor: string | null): Promise<PaginaRecibidas> {
  if (USAR_FIXTURES) {
    await pausa(400)
    await obtenerMiVacante(vacanteId)
    const recibidas = leerPostulacionesDemo().filter((p) => p.vacanteId === vacanteId)
    // El cursor de los fixtures es la posición de inicio.
    const inicio = Number(cursor ?? 0)
    const fin = inicio + TAMANO_PAGINA
    return {
      postulaciones: recibidas.slice(inicio, fin).map((p) => ({
        id: p.id,
        estado: p.estado,
        creadaEn: p.creadaEn,
        nombre: `${p.candidato.nombres} ${p.candidato.apellidos}`,
        carrera: p.candidato.carrera,
        semestre: p.candidato.semestre,
        anioGrado: p.candidato.anioGrado,
      })),
      siguiente: fin < recibidas.length ? String(fin) : null,
    }
  }
  const params = new URLSearchParams()
  if (cursor) params.set('cursor', cursor)
  const respuesta = await api.get<{ data: RecibidaServidor[]; meta: { next_cursor: string | null } }>(
    `/api/v1/empresa/vacantes/${encodeURIComponent(vacanteId)}/postulaciones?${params.toString()}`,
  )
  return { postulaciones: respuesta.data.map(recibidaDesdeServidor), siguiente: respuesta.meta.next_cursor }
}

// Detalle de una postulación: mensaje, perfil visible e historial de estados (API-28).
export async function obtenerPostulacionRecibida(id: string): Promise<DetallePostulacionRecibida> {
  if (USAR_FIXTURES) {
    await pausa(300)
    return detalleDesdeDemo(await buscarPropia(id))
  }
  const respuesta = await api.get<{ data: DetalleServidor }>(`/api/v1/empresa/postulaciones/${encodeURIComponent(id)}`)
  return detalleDesdeServidor(respuesta.data)
}

// Cambia el estado de una postulación y registra quién lo hizo y cuándo (HU-47, API-27).
export async function cambiarEstadoPostulacion(
  id: string,
  estado: EstadoPostulacion,
): Promise<DetallePostulacionRecibida> {
  if (USAR_FIXTURES) {
    await pausa(500)
    const postulacion = await buscarPropia(id)
    if (postulacion.estado === estado) throw new ApiError(422, 'La postulación ya está en ese estado.')
    const usuario = await obtenerSesion()
    const cambio: CambioEstado = { estado, fecha: new Date().toISOString(), responsable: usuario?.correo ?? '' }
    const nueva: PostulacionDemo = { ...postulacion, estado, historial: [...postulacion.historial, cambio] }
    guardarPostulacionesDemo(leerPostulacionesDemo().map((p) => (p.id === id ? nueva : p)))
    return detalleDesdeDemo(nueva)
  }
  const respuesta = await api.patch<{ data: DetalleServidor }>(
    `/api/v1/empresa/postulaciones/${encodeURIComponent(id)}/estado`,
    { estado },
  )
  return detalleDesdeServidor(respuesta.data)
}