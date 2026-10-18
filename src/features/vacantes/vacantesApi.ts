import { obtenerSesion, USAR_FIXTURES } from '@/features/auth/sesionApi'
import type { FiltrosVacantes } from '@/features/vacantes/filtros'
import { MODALIDADES, TIPOS_VACANTE, type EstadoVacante, type Vacante } from '@/features/vacantes/tipos'
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

// Cantidad de vacantes por página en el listado.
export const TAMANO_PAGINA = 5

export type PaginaVacantes = {
  vacantes: Vacante[]
  // Cursor de la página siguiente; null si no hay más.
  siguiente: string | null
}

// Con fixtures: ofertas de ejemplo de otras empresas para probar filtros y paginación.
const TITULOS_EJEMPLO = [
  'Desarrollador web',
  'Analista de datos',
  'Soporte técnico',
  'Asistente administrativo',
  'Diseñador gráfico',
  'Auxiliar contable',
]
const CIUDADES_EJEMPLO = ['Valledupar', 'Bogotá', 'Barranquilla']

const CATALOGO: Vacante[] = Array.from({ length: 12 }, (_, i) => ({
  id: `catalogo-${i + 1}`,
  tipo: TIPOS_VACANTE[i % 3],
  titulo: `${TITULOS_EJEMPLO[i % 6]} (${i + 1})`,
  descripcion: `Oferta de ejemplo número ${i + 1} para probar el listado.`,
  requisitos: 'Requisitos de ejemplo.',
  ciudad: CIUDADES_EJEMPLO[i % 3],
  modalidad: MODALIDADES[i % 3],
  estado: 'ACTIVA',
  fechaCierre: '2026-12-31',
  carreraIds: [1 + (i % 3)],
  empresa: `Empresa de ejemplo ${(i % 4) + 1}`,
}))

// Listado de vacantes activas con filtros y paginación por cursor (FE-21).
export async function listarVacantes(filtros: FiltrosVacantes, cursor: string | null): Promise<PaginaVacantes> {
  if (USAR_FIXTURES) {
    await pausa(400)
    const texto = filtros.texto.toLowerCase()
    const ciudad = filtros.ciudad.toLowerCase()
    const coinciden = [...leerGuardadas(), ...CATALOGO].filter(
      (v) =>
        v.estado === 'ACTIVA' &&
        (!texto || `${v.titulo} ${v.descripcion}`.toLowerCase().includes(texto)) &&
        (!filtros.tipo || v.tipo === filtros.tipo) &&
        (!filtros.modalidad || v.modalidad === filtros.modalidad) &&
        (!ciudad || v.ciudad.toLowerCase().includes(ciudad)) &&
        (!filtros.carreraId || v.carreraIds.includes(Number(filtros.carreraId))),
    )
    const inicio = Number(cursor ?? 0)
    const fin = inicio + TAMANO_PAGINA
    return {
      vacantes: coinciden.slice(inicio, fin),
      siguiente: fin < coinciden.length ? String(fin) : null,
    }
  }
  const params = new URLSearchParams()
  if (filtros.texto) params.set('q', filtros.texto)
  if (filtros.tipo) params.set('tipo', filtros.tipo)
  if (filtros.modalidad) params.set('modalidad', filtros.modalidad)
  if (filtros.ciudad) params.set('ciudad', filtros.ciudad)
  if (filtros.carreraId) params.set('carrera_id', filtros.carreraId)
  if (cursor) params.set('cursor', cursor)
  const respuesta = await api.get<{ data: VacanteServidor[]; meta: { next_cursor: string | null } }>(
    `/api/v1/vacantes?${params.toString()}`,
  )
  return {
    vacantes: respuesta.data.map(vacanteDesdeServidor),
    siguiente: respuesta.meta.next_cursor,
  }
}

// Clave de caché del detalle de una vacante.
export const claveVacante = (id: string) => ['vacante', id]

// Detalle de una vacante (FE-22). Si no existe, el error es 404.
export async function obtenerVacante(id: string): Promise<Vacante> {
  if (USAR_FIXTURES) {
    await pausa(400)
    const vacante = [...leerGuardadas(), ...CATALOGO].find((v) => v.id === id)
    if (!vacante) throw new ApiError(404, 'No encontramos esa vacante.')
    return vacante
  }
  const respuesta = await api.get<{ data: VacanteServidor }>(`/api/v1/vacantes/${encodeURIComponent(id)}`)
  return vacanteDesdeServidor(respuesta.data)
}

// Guarda los cambios de una vacante de la empresa (FE-20, API-20).
export async function actualizarVacante(id: string, datos: VacanteDatos): Promise<void> {
  if (USAR_FIXTURES) {
    await pausa(600)
    const guardadas = leerGuardadas()
    if (!guardadas.some((v) => v.id === id)) throw new ApiError(404, 'No encontramos esa vacante.')
    const nuevas = guardadas.map((v) =>
      v.id === id
        ? {
            ...v,
            tipo: datos.tipo,
            titulo: datos.titulo,
            descripcion: datos.descripcion,
            requisitos: datos.requisitos,
            ciudad: datos.ciudad,
            modalidad: datos.modalidad,
            fechaCierre: datos.fechaCierre,
            carreraIds: datos.carreraIds.map(Number),
          }
        : v,
    )
    sessionStorage.setItem(CLAVE_DEMO, JSON.stringify(nuevas))
    return
  }
  try {
    await api.put(`/api/v1/empresa/vacantes/${encodeURIComponent(id)}`, {
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
      if (error.status === 403) {
        throw new ApiError(403, error.mensajeServidor ?? 'No puedes editar esta vacante.')
      }
      if (error.status === 422) {
        throw new ApiError(422, error.message, traducirCampos(error.campos))
      }
    }
    throw error
  }
}