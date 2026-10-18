import { obtenerSesion, USAR_FIXTURES } from '@/features/auth/sesionApi'
import { obtenerPerfil } from '@/features/perfil/perfilApi'
import {
  guardarPostulacionesDemo,
  leerPostulacionesDemo,
} from '@/features/postulaciones/postulacionesDemo'
import type { Postulacion } from '@/features/postulaciones/tipos'
import { obtenerVacante, TAMANO_PAGINA } from '@/features/vacantes/vacantesApi'
import { ApiError } from '@/shared/api/apiError'
import { api } from '@/shared/api/client'

// Clave de TanStack Query para las listas de postulaciones (FE-24 y FE-25).
export const CLAVE_POSTULACIONES = ['postulaciones'] as const
export const CLAVE_MIS_POSTULACIONES = [...CLAVE_POSTULACIONES, 'mias'] as const

const pausa = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

// Postularse a una vacante con un mensaje opcional (HU-45 / FE-23, API-24).
// Con fixtures solo se acepta una vacante abierta y una sola postulación por vacante.
export async function postularse(vacanteId: string, mensaje: string): Promise<void> {
  if (USAR_FIXTURES) {
    await pausa(600)
    const usuario = await obtenerSesion()
    const vacante = await obtenerVacante(vacanteId)
    if (!vacante.abierta) {
      throw new ApiError(422, 'Esta vacante ya no recibe postulaciones.')
    }
    const perfil = await obtenerPerfil()
    if (!perfil) throw new ApiError(403, 'Completa tu perfil (carrera y semestre, o año de grado) antes de postularte.')
    const guardadas = leerPostulacionesDemo()
    const correo = usuario?.correo ?? ''
    const ahora = new Date().toISOString()
    if (guardadas.some((p) => p.vacanteId === vacanteId && p.candidatoCorreo === correo)) {
      throw new ApiError(422, 'Ya te postulaste a esta vacante.')
    }
    guardarPostulacionesDemo([
      {
        id: crypto.randomUUID(),
        vacanteId,
        vacanteTitulo: vacante.titulo,
        empresa: vacante.empresa,
        mensaje: mensaje.trim(),
        estado: 'RECIBIDA',
        creadaEn: ahora,
        candidatoCorreo: correo,
        candidato: {
          nombres: perfil.nombres,
          apellidos: perfil.apellidos,
          titular: perfil.titular,
          descripcion: perfil.descripcion,
          carrera: perfil.carreraNombre,
          semestre: perfil.semestre,
          anioGrado: perfil.anioGrado,
          ciudad: perfil.ciudad,
          intereses: perfil.intereses,
        },
        historial: [{ estado: 'RECIBIDA', fecha: ahora, responsable: 'Sistema' }],
      },
      ...guardadas,
    ])
    return
  }
  const cuerpo = mensaje.trim() ? { mensaje: mensaje.trim() } : {}
  try {
    await api.post(`/api/v1/vacantes/${encodeURIComponent(vacanteId)}/postulaciones`, cuerpo)
  } catch (error) {
    // En un 403 el servidor dice el motivo real (por ejemplo, que falta completar el perfil).
    if (error instanceof ApiError && error.status === 403) {
      throw new ApiError(403, error.mensajeServidor ?? error.message)
    }
    throw error
  }
}

export type PaginaPostulaciones = {
  postulaciones: Postulacion[]
  // Cursor de la página siguiente; null si no hay más.
  siguiente: string | null
}

// Forma de cada postulación en GET /api/v1/me/postulaciones, según el contrato de José (BE-31).
// «actualizada_en» y «vacante.abierta» todavía no se muestran.
export type PostulacionServidor = {
  id: string
  estado: Postulacion['estado']
  mensaje: string | null
  creada_en: string
  actualizada_en: string
  vacante: {
    id: string
    titulo: string
    abierta: boolean
    empresa: { id: string | number; razon_social: string }
  }
}

type PaginaServidor = {
  data: PostulacionServidor[]
  meta: { next_cursor: string | null }
}

export function postulacionDesdeServidor(p: PostulacionServidor): Postulacion {
  return {
    id: p.id,
    vacanteId: p.vacante.id,
    vacanteTitulo: p.vacante.titulo,
    empresa: p.vacante.empresa.razon_social,
    mensaje: p.mensaje ?? '',
    estado: p.estado,
    creadaEn: p.creada_en,
  }
}

// Postulaciones de la persona con sesión, de la más reciente a la más antigua, por cursor (HU-46 / FE-24, API-25).
export async function listarMisPostulaciones(cursor: string | null): Promise<PaginaPostulaciones> {
  if (USAR_FIXTURES) {
    await pausa(400)
    const usuario = await obtenerSesion()
    const propias = leerPostulacionesDemo().filter((p) => p.candidatoCorreo === (usuario?.correo ?? ''))
    // El cursor de los fixtures es la posición de inicio.
    const inicio = Number(cursor ?? 0)
    const fin = inicio + TAMANO_PAGINA
    return {
      postulaciones: propias.slice(inicio, fin),
      siguiente: fin < propias.length ? String(fin) : null,
    }
  }
  const params = new URLSearchParams()
  if (cursor) params.set('cursor', cursor)
  const respuesta = await api.get<PaginaServidor>(`/api/v1/me/postulaciones?${params.toString()}`)
  return {
    postulaciones: respuesta.data.map(postulacionDesdeServidor),
    siguiente: respuesta.meta.next_cursor,
  }
}