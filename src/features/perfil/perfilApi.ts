import { datosAPerfil } from '@/features/perfil/conversiones'
import type { PerfilDatos } from '@/features/perfil/perfilEsquema'
import type { Carrera, Perfil } from '@/features/perfil/tipos'
import { USAR_FIXTURES } from '@/features/auth/sesionApi'
import { ApiError } from '@/shared/api/apiError'
import { api } from '@/shared/api/client'

// Claves de TanStack Query.
export const CLAVE_PERFIL = ['perfil'] as const
export const CLAVE_CARRERAS = ['carreras'] as const

const CLAVE_DEMO = 'upc-perfil-demo'
const pausa = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

// Forma en que el servidor envía el perfil (nombres en snake_case).
type PerfilServidor = {
  nombres: string
  apellidos: string
  titular: string | null
  descripcion: string | null
  carrera_id: number
  semestre: number
  anio_grado: number | null
  ciudad: string | null
  intereses: string[]
}

function desdeServidor(p: PerfilServidor): Perfil {
  return {
    nombres: p.nombres,
    apellidos: p.apellidos,
    titular: p.titular ?? '',
    descripcion: p.descripcion ?? '',
    carreraId: p.carrera_id,
    semestre: p.semestre,
    anioGrado: p.anio_grado,
    ciudad: p.ciudad ?? '',
    intereses: p.intereses,
  }
}

// Carreras de ejemplo para el modo demo (una desactivada, para probar esa regla).
const CARRERAS_DEMO: Carrera[] = [
  { id: 1, nombre: 'Ingeniería de Sistemas', facultad: 'Ingenierías y Tecnologías', activa: true },
  { id: 2, nombre: 'Ingeniería Electrónica', facultad: 'Ingenierías y Tecnologías', activa: true },
  { id: 3, nombre: 'Administración de Empresas', facultad: 'Ciencias Administrativas', activa: true },
  { id: 4, nombre: 'Contaduría Pública', facultad: 'Ciencias Administrativas', activa: true },
  { id: 5, nombre: 'Derecho', facultad: 'Ciencias Jurídicas', activa: true },
  { id: 6, nombre: 'Tecnología en Sistemas (programa cerrado)', facultad: 'Ingenierías y Tecnologías', activa: false },
]

// Catálogo de carreras (API-10).
export async function obtenerCarreras(): Promise<Carrera[]> {
  if (USAR_FIXTURES) {
    await pausa(300)
    return CARRERAS_DEMO
  }
  return api.get<Carrera[]>('/api/v1/carreras')
}

// Perfil de la persona con sesión (API-12). Devuelve null si todavía no lo ha creado (404).
export async function obtenerPerfil(): Promise<Perfil | null> {
  if (USAR_FIXTURES) {
    const guardado = sessionStorage.getItem(CLAVE_DEMO)
    return guardado ? (JSON.parse(guardado) as Perfil) : null
  }
  try {
    return desdeServidor(await api.get<PerfilServidor>('/api/v1/me/perfil'))
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

// Crea o actualiza el perfil (API-13).
export async function guardarPerfil(datos: PerfilDatos): Promise<Perfil> {
  const perfil = datosAPerfil(datos)
  if (USAR_FIXTURES) {
    await pausa(600)
    sessionStorage.setItem(CLAVE_DEMO, JSON.stringify(perfil))
    return perfil
  }
  await api.put('/api/v1/me/perfil', {
    nombres: perfil.nombres,
    apellidos: perfil.apellidos,
    titular: perfil.titular,
    descripcion: perfil.descripcion,
    carrera_id: perfil.carreraId,
    semestre: perfil.semestre,
    anio_grado: perfil.anioGrado,
    ciudad: perfil.ciudad,
    intereses: perfil.intereses,
  })
  return perfil
}