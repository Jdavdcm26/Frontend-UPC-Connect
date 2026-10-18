import { obtenerSesion, USAR_FIXTURES } from '@/features/auth/sesionApi'
import { CARRERAS_DEMO } from '@/features/perfil/carrerasDemo'
import { leerPostulacionesDemo } from '@/features/postulaciones/postulacionesDemo'
import type { FiltrosVacantes } from '@/features/vacantes/filtros'
import { MODALIDADES, TIPOS_VACANTE, type EstadoVacante, type Vacante } from '@/features/vacantes/tipos'
import type { VacanteDatos } from '@/features/vacantes/vacanteEsquema'
import { ApiError } from '@/shared/api/apiError'
import { api } from '@/shared/api/client'
import { hoyLocal } from '@/shared/lib/fechas'

const CLAVE_DEMO = 'upc-vacantes-demo'
const pausa = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

// Cantidad de vacantes por página en los fixtures (el servidor entrega 15 por página).
export const TAMANO_PAGINA = 5

export type PaginaVacantes = {
  vacantes: Vacante[]
  // Cursor de la página siguiente; null si no hay más.
  siguiente: string | null
}

// ---------- Contrato con el servidor ----------

// Forma de una vacante en el servidor. «empresa» solo viene en las vacantes públicas.
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
  // Solo viene si el servidor cargó las carreras de la vacante.
  carreras?: { id: string; nombre: string }[]
  empresa?: { id: string | number; razon_social: string; ciudad?: string }
  // Provisional: pendiente de confirmar con José.
  ya_postulado?: boolean
}

type PaginaServidor = {
  data: VacanteServidor[]
  meta: { next_cursor: string | null }
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
    carreraIds: (v.carreras ?? []).map((c) => c.id),
    empresa: v.empresa?.razon_social ?? '',
    yaPostulado: v.ya_postulado ?? false,
  }
}

function paginaDesdeServidor(respuesta: PaginaServidor): PaginaVacantes {
  return {
    vacantes: respuesta.data.map(vacanteDesdeServidor),
    siguiente: respuesta.meta.next_cursor,
  }
}

// Cuerpo de POST y PUT de una vacante.
function cuerpoVacante(datos: VacanteDatos) {
  return {
    tipo: datos.tipo,
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    requisitos: datos.requisitos,
    ciudad: datos.ciudad,
    modalidad: datos.modalidad,
    fecha_cierre: datos.fechaCierre,
    carreras: datos.carreraIds,
  }
}

// Nombres de campo del servidor -> nombres del formulario.
const CAMPOS: Record<string, string> = {
  carreras: 'carreraIds',
  fecha_cierre: 'fechaCierre',
}

function traducirCampos(campos: Record<string, string[]>): Record<string, string[]> {
  const traducidos: Record<string, string[]> = {}
  for (const [campo, mensajes] of Object.entries(campos)) {
    // El servidor puede señalar un elemento de la lista (por ejemplo, «carreras.0»).
    const base = campo.split('.')[0]
    const nombre = CAMPOS[base] ?? base
    traducidos[nombre] = [...(traducidos[nombre] ?? []), ...mensajes]
  }
  return traducidos
}

// Errores al guardar una vacante: 403 con el motivo del servidor y 422 con los campos traducidos.
function relanzarError(error: unknown, mensaje403: string): never {
  if (error instanceof ApiError) {
    if (error.status === 403) {
      throw new ApiError(403, error.mensajeServidor ?? mensaje403)
    }
    if (error.status === 422) {
      throw new ApiError(422, error.message, traducirCampos(error.campos))
    }
  }
  throw error
}

// ---------- Datos de prueba (fixtures) ----------

// Ids de las carreras activas de ejemplo.
const IDS_CARRERAS_DEMO = CARRERAS_DEMO.filter((c) => c.activa).map((c) => c.id)

// Ejemplos que aparecen la primera vez que se abre la lista de la empresa.
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
    carreraIds: [IDS_CARRERAS_DEMO[0]],
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
    carreraIds: [IDS_CARRERAS_DEMO[0]],
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
    carreraIds: [IDS_CARRERAS_DEMO[0]],
    empresa: 'Mi empresa (demo)',
  },
]

// Ofertas de ejemplo de otras empresas para probar filtros y paginación.
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
  carreraIds: [IDS_CARRERAS_DEMO[i % 3]],
  empresa: `Empresa de ejemplo ${(i % 4) + 1}`,
}))

// Lee las vacantes guardadas en la pestaña; si no hay, guarda los ejemplos.
function leerGuardadas(): Vacante[] {
  const texto = sessionStorage.getItem(CLAVE_DEMO)
  if (texto === null) {
    sessionStorage.setItem(CLAVE_DEMO, JSON.stringify(EJEMPLOS))
    return EJEMPLOS
  }
  return JSON.parse(texto) as Vacante[]
}

function guardar(vacantes: Vacante[]): void {
  sessionStorage.setItem(CLAVE_DEMO, JSON.stringify(vacantes))
}

// Corta una lista en páginas; el cursor de los fixtures es la posición de inicio.
function paginar(lista: Vacante[], cursor: string | null): PaginaVacantes {
  const inicio = Number(cursor ?? 0)
  const fin = inicio + TAMANO_PAGINA
  return {
    vacantes: lista.slice(inicio, fin),
    siguiente: fin < lista.length ? String(fin) : null,
  }
}

// ---------- Llamadas ----------

// Publica una vacante (HU-41 / FE-19, API-19).
// Con fixtures, un correo con «noaprobada» simula una empresa sin aprobar.
export async function crearVacante(datos: VacanteDatos): Promise<void> {
  if (USAR_FIXTURES) {
    await pausa(600)
    const usuario = await obtenerSesion()
    if (usuario?.correo.includes('noaprobada')) {
      throw new ApiError(403, 'Tu empresa aún no ha sido aprobada, así que todavía no puedes publicar vacantes.')
    }
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
      carreraIds: datos.carreraIds,
      empresa: 'Mi empresa (demo)',
    }
    guardar([nueva, ...leerGuardadas()])
    return
  }
  try {
    await api.post('/api/v1/empresa/vacantes', cuerpoVacante(datos))
  } catch (error) {
    relanzarError(error, 'Tu empresa aún no puede publicar vacantes.')
  }
}

// Clave de caché de la lista de vacantes de la empresa.
export const CLAVE_MIS_VACANTES = ['mis-vacantes']

// Vacantes de la empresa que inició sesión, en todos los estados, por cursor (FE-20).
export async function listarMisVacantes(cursor: string | null): Promise<PaginaVacantes> {
  if (USAR_FIXTURES) {
    await pausa(400)
    return paginar(leerGuardadas(), cursor)
  }
  const params = new URLSearchParams()
  if (cursor) params.set('cursor', cursor)
  const consulta = params.toString()
  const respuesta = await api.get<PaginaServidor>(`/api/v1/empresa/vacantes${consulta ? `?${consulta}` : ''}`)
  return paginaDesdeServidor(respuesta)
}

// Clave de caché de una vacante propia de la empresa.
export const claveMiVacante = (id: string) => ['mi-vacante', id]

// Detalle de una vacante propia (FE-20). Una vacante de otra empresa responde 404.
export async function obtenerMiVacante(id: string): Promise<Vacante> {
  if (USAR_FIXTURES) {
    await pausa(400)
    const vacante = leerGuardadas().find((v) => v.id === id)
    if (!vacante) throw new ApiError(404, 'No encontramos esa vacante.')
    return vacante
  }
  const respuesta = await api.get<{ data: VacanteServidor }>(`/api/v1/empresa/vacantes/${encodeURIComponent(id)}`)
  return vacanteDesdeServidor(respuesta.data)
}

// Guarda los cambios de una vacante de la empresa (FE-20, API-20).
// El servidor responde 403 si la vacante está cerrada.
export async function actualizarVacante(id: string, datos: VacanteDatos): Promise<void> {
  if (USAR_FIXTURES) {
    await pausa(600)
    const guardadas = leerGuardadas()
    const actual = guardadas.find((v) => v.id === id)
    if (!actual) throw new ApiError(404, 'No encontramos esa vacante.')
    if (actual.estado === 'CERRADA') throw new ApiError(403, 'Una vacante cerrada no se puede editar.')
    guardar(
      guardadas.map((v) =>
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
              carreraIds: datos.carreraIds,
            }
          : v,
      ),
    )
    return
  }
  try {
    await api.put(`/api/v1/empresa/vacantes/${encodeURIComponent(id)}`, cuerpoVacante(datos))
  } catch (error) {
    relanzarError(error, 'No puedes editar esta vacante.')
  }
}

// Pausar, reanudar o cerrar una vacante (FE-20).
// El servidor no reabre una cerrada ni reactiva una con la fecha vencida (422).
export async function cambiarEstadoVacante(id: string, estado: EstadoVacante): Promise<void> {
  if (USAR_FIXTURES) {
    await pausa(300)
    const guardadas = leerGuardadas()
    const actual = guardadas.find((v) => v.id === id)
    if (!actual) throw new ApiError(404, 'No encontramos esa vacante.')
    if (actual.estado === 'CERRADA') {
      throw new ApiError(422, 'Una vacante cerrada no se puede reabrir.')
    }
    if (estado === 'ACTIVA' && actual.fechaCierre < hoyLocal()) {
      throw new ApiError(422, 'No puedes reactivar una vacante con la fecha de cierre vencida.')
    }
    guardar(guardadas.map((v) => (v.id === id ? { ...v, estado } : v)))
    return
  }
  await api.patch(`/api/v1/empresa/vacantes/${encodeURIComponent(id)}/estado`, { estado })
}

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
        (!filtros.carreraId || v.carreraIds.includes(filtros.carreraId)),
    )
    return paginar(coinciden, cursor)
  }
  const params = new URLSearchParams()
  if (filtros.texto) params.set('q', filtros.texto)
  if (filtros.tipo) params.set('tipo', filtros.tipo)
  if (filtros.modalidad) params.set('modalidad', filtros.modalidad)
  if (filtros.ciudad) params.set('ciudad', filtros.ciudad)
  if (filtros.carreraId) params.set('carrera_id', filtros.carreraId)
  if (cursor) params.set('cursor', cursor)
  const respuesta = await api.get<PaginaServidor>(`/api/v1/vacantes?${params.toString()}`)
  return paginaDesdeServidor(respuesta)
}

// Clave de caché del detalle público de una vacante.
export const claveVacante = (id: string) => ['vacante', id]

// Detalle público de una vacante (FE-22). Si no existe, el error es 404.
export async function obtenerVacante(id: string): Promise<Vacante> {
  if (USAR_FIXTURES) {
    await pausa(400)
    const vacante = [...leerGuardadas(), ...CATALOGO].find((v) => v.id === id)
    if (!vacante) throw new ApiError(404, 'No encontramos esa vacante.')
    const correo = (await obtenerSesion())?.correo ?? ''
    const yaPostulado = leerPostulacionesDemo().some((p) => p.vacanteId === id && p.candidatoCorreo === correo)
    return { ...vacante, yaPostulado }
  }
  const respuesta = await api.get<{ data: VacanteServidor }>(`/api/v1/vacantes/${encodeURIComponent(id)}`)
  return vacanteDesdeServidor(respuesta.data)
}