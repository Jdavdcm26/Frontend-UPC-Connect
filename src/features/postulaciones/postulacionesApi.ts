import { obtenerSesion, USAR_FIXTURES } from '@/features/auth/sesionApi'
import {
  guardarPostulacionesDemo,
  leerPostulacionesDemo,
} from '@/features/postulaciones/postulacionesDemo'
import { obtenerVacante } from '@/features/vacantes/vacantesApi'
import { ApiError } from '@/shared/api/apiError'
import { api } from '@/shared/api/client'

// Clave de TanStack Query para las listas de postulaciones (FE-24 y FE-25).
export const CLAVE_POSTULACIONES = ['postulaciones'] as const

const pausa = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

// Postularse a una vacante con un mensaje opcional (HU-45 / FE-23, API-24).
// Con fixtures solo se acepta una vacante activa y una sola postulación por vacante.
export async function postularse(vacanteId: string, mensaje: string): Promise<void> {
  if (USAR_FIXTURES) {
    await pausa(600)
    const usuario = await obtenerSesion()
    const vacante = await obtenerVacante(vacanteId)
    if (vacante.estado !== 'ACTIVA') {
      throw new ApiError(422, 'Esta vacante ya no recibe postulaciones.')
    }
    const guardadas = leerPostulacionesDemo()
    const correo = usuario?.correo ?? ''
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
        creadaEn: new Date().toISOString(),
        candidatoCorreo: correo,
      },
      ...guardadas,
    ])
    return
  }
  const cuerpo = mensaje.trim() ? { mensaje: mensaje.trim() } : {}
  await api.post(`/api/v1/vacantes/${encodeURIComponent(vacanteId)}/postulaciones`, cuerpo)
}