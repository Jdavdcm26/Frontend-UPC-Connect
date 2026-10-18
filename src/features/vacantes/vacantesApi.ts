import { obtenerSesion, USAR_FIXTURES } from '@/features/auth/sesionApi'
import type { EstadoVacante, Vacante } from '@/features/vacantes/tipos'
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
    const guardadas = leerGuardadas()
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

// Clave de caché de la lista de vacantes de la empresa.
export const CLAVE_MIS_VACANTES = ['mis-vacantes']

// Con fixtures: ejemplos que aparecen la primera vez que se abre la lista.
const EJEMPLOS: Vacante[] = [
  {
    id: 'demo-1',
    tipo: 'VACANTE',
    titulo: 'Desarrollador web junior',
    descripcion: 'Apoyo en el desarrollo de aplicaciones web.',
    requisitos: 'Conocimientos de HTML, CSS y JavaScript.',
    ciudad: 'Valledupar',
    modalidad: 'HIBRIDA',
    estado: 'ACTIVA',
    fechaCierre: '2026-12-31',
    carreraIds: [1],
    empresa: 'Mi empresa (demo)',
  },
  {
    id: 'demo-2',
    tipo: 'PRACTICA',
    titulo: 'Práctica en soporte técnico',
    descripcion: 'Atención y soporte a usuarios internos.',
    requisitos: 'Estudiante de últimos semestres.',
    ciudad: 'Valledupar',
    modalidad: 'PRESENCIAL',
    estado: 'PAUSADA',
    fechaCierre: '2026-11-30',
    carreraIds: [1],
    empresa: 'Mi empresa (demo)',
  },
  {
    id: 'demo-3',
    tipo: 'PASANTIA',
    titulo: 'Pasantía en análisis de datos',
    descripcion: 'Limpieza y análisis de datos de ventas.',
    requisitos: 'Manejo básico de hojas de cálculo.',
    ciudad: 'Bogotá',
    modalidad: 'REMOTA',
    estado: 'CERRADA',
    fechaCierre: '2026-10-01',
    carreraIds: [1],
    empresa: 'Mi empresa (demo)',
  },
]

// Lee las vacantes guardadas en la pestaña; si no hay, guarda los ejemplos.
function leerGuardadas(): Vacante[] {
  const texto = sessionStorage.getItem(CLAVE_DEMO)
  if (texto === null) {
    sessionStorage.setItem(CLAVE_DEMO, JSON.stringify(EJEMPLOS))
    return EJEMPLOS
  }
  return JSON.parse(texto) as Vacante[]
}

// Forma provisional de la vacante en el servidor (se ajusta cuando José confirme el contrato).
type VacanteServidor = {
  id: string
  tipo: Vacante['tipo']
  titulo: string
  descripcion: string
  requisitos: string
  ciudad: string
  modalidad: Vacante['modalidad']
  estado: EstadoVacante
  fecha_cierre: string
  carrera_ids: number[]
  empresa?: string
}

function vacanteDesdeServidor(v: VacanteServidor): Vacante {
  return {
    id: v.id,
    tipo: v.tipo,
    titulo: v.titulo,
    descripcion: v.descripcion,
    requisitos: v.requisitos,
    ciudad: v.ciudad,
    modalidad: v.modalidad,
    estado: v.estado,
    fechaCierre: v.fecha_cierre,
    carreraIds: v.carrera_ids,
    empresa: v.empresa ?? '',
  }
}

// Vacantes de la empresa que inició sesión (FE-20).
export async function listarMisVacantes(): Promise<Vacante[]> {
  if (USAR_FIXTURES) {
    await pausa(400)
    return leerGuardadas()
  }
  const respuesta = await api.get<{ data: VacanteServidor[] }>('/api/v1/empresa/vacantes')
  return respuesta.data.map(vacanteDesdeServidor)
}

// Pausar, reanudar o cerrar una vacante (FE-20).
export async function cambiarEstadoVacante(id: string, estado: EstadoVacante): Promise<void> {
  if (USAR_FIXTURES) {
    await pausa(300)
    const cambiadas = leerGuardadas().map((v) => (v.id === id ? { ...v, estado } : v))
    sessionStorage.setItem(CLAVE_DEMO, JSON.stringify(cambiadas))
    return
  }
  await api.patch(`/api/v1/empresa/vacantes/${id}/estado`, { estado })
}