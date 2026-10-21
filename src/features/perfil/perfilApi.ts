import { CARRERAS_DEMO } from '@/features/perfil/carrerasDemo'
import {
  cuerpoPerfil,
  datosAPerfil,
  perfilDesdeServidor,
  type PerfilServidor,
} from '@/features/perfil/conversiones'
import type { PerfilDatos } from '@/features/perfil/perfilEsquema'
import type { Carrera, Perfil } from '@/features/perfil/tipos'
import { USAR_FIXTURES } from '@/features/auth/sesionApi'
import { ApiError } from '@/shared/api/apiError'
import { api } from '@/shared/api/client'

const CLAVE_DEMO = 'upc-perfil-demo'
const pausa = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

// Con fixtures, el perfil vive en la pestaña (sessionStorage). Uno guardado antes de FE-17 no trae habilidades.
export function leerPerfilDemo(): Perfil | null {
  const guardado = sessionStorage.getItem(CLAVE_DEMO)
  if (!guardado) return null
  const perfil = JSON.parse(guardado) as Partial<Perfil> & Omit<Perfil, 'habilidades'>
  return { ...perfil, habilidades: perfil.habilidades ?? [] }
}

export function guardarPerfilDemo(perfil: Perfil): void {
  sessionStorage.setItem(CLAVE_DEMO, JSON.stringify(perfil))
}

// Catálogo de carreras (API-10). El servidor solo lista las activas.
export async function obtenerCarreras(): Promise<Carrera[]> {
  if (USAR_FIXTURES) {
    await pausa(300)
    return CARRERAS_DEMO
  }
  const respuesta = await api.get<{ data: { id: string; nombre: string; facultad: string }[] }>('/api/v1/carreras')
  return respuesta.data.map((c) => ({ id: c.id, nombre: c.nombre, facultad: c.facultad, activa: true }))
}

// Perfil de la persona con sesión (API-12). Devuelve null si todavía no lo ha creado (404).
export async function obtenerPerfil(): Promise<Perfil | null> {
  if (USAR_FIXTURES) {
    return leerPerfilDemo()
  }
  try {
    const respuesta = await api.get<{ data: PerfilServidor }>('/api/v1/me/perfil')
    return perfilDesdeServidor(respuesta.data)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

// Crea o actualiza el perfil (API-13). Los egresados envían año de grado; los estudiantes, semestre.
export async function guardarPerfil(datos: PerfilDatos, esEgresado: boolean): Promise<Perfil> {
  if (USAR_FIXTURES) {
    await pausa(600)
    const carrera = CARRERAS_DEMO.find((c) => c.id === datos.carreraId)
    const perfil = datosAPerfil(datos, esEgresado, carrera?.nombre ?? '', leerPerfilDemo()?.habilidades)
    guardarPerfilDemo(perfil)
    return perfil
  }
  // El nombre de la carrera lo devuelve el servidor en la respuesta.
  const cuerpo = cuerpoPerfil(datosAPerfil(datos, esEgresado, ''))
  const respuesta = await api.put<{ data: PerfilServidor }>('/api/v1/me/perfil', cuerpo)
  return perfilDesdeServidor(respuesta.data)
}