import { obtenerSesion, USAR_FIXTURES } from '@/features/auth/sesionApi'
import type { Vacante } from '@/features/vacantes/tipos'
import type { VacanteDatos } from '@/features/vacantes/vacanteEsquema'
import { ApiError } from '@/shared/api/apiError'
import { api } from '@/shared/api/client'

const CLAVE_DEMO = 'upc-vacantes-demo'
const pausa = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

// Nombres de campo del servidor -> nombres del formulario.
const CAMPOS: Record<string, string> = {
  carrera_ids: 'carreraIds',
  fecha_cierre: 'fechaCierre',
}

function traducirCampos(campos: Record<string, string[]>): Record<string, string[]> {
  const traducidos: Record<string, string[]> = {}
  for (const [campo, mensajes] of Object.entries(campos)) {
    traducidos[CAMPOS[campo] ?? campo] = mensajes
  }
  return traducidos
}

// Publica una vacante (HU-41 / FE-19, API-19).
// Con fixtures se guarda en la pestaña; un correo con «noaprobada» simula una empresa sin aprobar.
export async function crearVacante(datos: VacanteDatos): Promise<void> {
  if (USAR_FIXTURES) {
    await pausa(600)
    const usuario = await obtenerSesion()
    if (usuario?.correo.includes('noaprobada')) {
      throw new ApiError(403, 'Tu empresa aún no ha sido aprobada, así que todavía no puedes publicar vacantes.')
    }
    const guardadas = JSON.parse(sessionStorage.getItem(CLAVE_DEMO) ?? '[]') as Vacante[]
    const nueva: Vacante = {
      id: crypto.randomUUID(),
      tipo: datos.tipo,
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      requisitos: datos.requisitos,
      ciudad: datos.ciudad,
      modalidad: datos.modalidad,
      estado: 'ACTIVA',
      fechaCierre: datos.fechaCierre,
      carreraIds: datos.carreraIds.map(Number),
      empresa: 'Mi empresa (demo)',
    }
    sessionStorage.setItem(CLAVE_DEMO, JSON.stringify([nueva, ...guardadas]))
    return
  }
  try {
    await api.post('/api/v1/empresa/vacantes', {
      tipo: datos.tipo,
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      requisitos: datos.requisitos,
      carrera_ids: datos.carreraIds.map(Number),
      ciudad: datos.ciudad,
      modalidad: datos.modalidad,
      fecha_cierre: datos.fechaCierre,
    })
  } catch (error) {
    if (error instanceof ApiError) {
      // Empresa no aprobada: se muestra el impedimento que devuelve el servidor.
      if (error.status === 403) {
        throw new ApiError(403, error.mensajeServidor ?? 'Tu empresa aún no puede publicar vacantes.')
      }
      if (error.status === 422) {
        throw new ApiError(422, error.message, traducirCampos(error.campos))
      }
    }
    throw error
  }
}