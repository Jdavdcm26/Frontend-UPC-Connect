import { ApiError } from '@/shared/api/apiError'

// Dirección base de la API (variable de entorno). En staging web y API comparten dominio.
const BASE_URL: string = import.meta.env.VITE_API_URL ?? ''

type Metodo = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// Mensajes en español de Colombia que dicen cómo corregir (RNF-27).
// Tienen prioridad sobre el texto del servidor (en 401, 403, 404 y 419 viene en inglés).
const MENSAJES: Record<number, string> = {
  401: 'Debes iniciar sesión para continuar.',
  403: 'No tienes permiso para realizar esta acción.',
  404: 'No encontramos lo que buscas.',
  419: 'Tu sesión venció. Inicia sesión de nuevo.',
  422: 'Revisa los datos del formulario.',
  429: 'Demasiadas peticiones. Intenta de nuevo en unos segundos.',
}

// Lee una cookie del navegador (Sanctum deja XSRF-TOKEN).
function leerCookie(nombre: string): string | null {
  const par = document.cookie.split('; ').find((c) => c.startsWith(`${nombre}=`))
  return par ? decodeURIComponent(par.split('=')[1]) : null
}

// Pide la cookie CSRF una sola vez, antes de la primera escritura.
let csrfListo = false
async function obtenerCsrf() {
  if (csrfListo) return
  await fetch(`${BASE_URL}/api/sanctum/csrf-cookie`, { credentials: 'include' })
  csrfListo = true
}

// Convierte una respuesta con error en un ApiError normalizado.
async function crearError(respuesta: Response): Promise<ApiError> {
  let datos: { message?: string; errors?: Record<string, string[]> } = {}
  try {
    datos = await respuesta.json()
  } catch {
    // La respuesta no trae JSON: se usa el mensaje por defecto.
  }
  // En 422 y 429 el servidor ya responde en español: dice qué corregir o cuánto esperar.
  const delServidor = respuesta.status === 422 || respuesta.status === 429 ? datos.message : undefined
  const mensaje =
    delServidor ??
    MENSAJES[respuesta.status] ??
    datos.message ??
    'Ocurrió un error inesperado. Intenta de nuevo.'
  // Retry-After (segundos) indica cuánto esperar tras un bloqueo 429.
  const espera = Number.parseInt(respuesta.headers.get('Retry-After') ?? '', 10)
  return new ApiError(respuesta.status, mensaje, datos.errors, Number.isNaN(espera) ? undefined : espera, datos.message)
}

async function solicitar<T>(metodo: Metodo, ruta: string, cuerpo?: unknown): Promise<T> {
  const esEscritura = metodo !== 'GET'
  if (esEscritura) await obtenerCsrf()

  const headers: Record<string, string> = { Accept: 'application/json' }
  if (cuerpo !== undefined) headers['Content-Type'] = 'application/json'
  const token = leerCookie('XSRF-TOKEN')
  if (esEscritura && token) headers['X-XSRF-TOKEN'] = token

  let respuesta: Response
  try {
    respuesta = await fetch(`${BASE_URL}${ruta}`, {
      method: metodo,
      headers,
      credentials: 'include', // envía la cookie de sesión
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    })
  } catch {
    throw new ApiError(0, 'No hay conexión con el servidor. Revisa tu internet.')
  }

  if (!respuesta.ok) {
    // Con 419 la cookie CSRF venció: se vuelve a pedir en la próxima escritura.
    if (respuesta.status === 419) csrfListo = false
    throw await crearError(respuesta)
  }
  if (respuesta.status === 204) return undefined as T
  return (await respuesta.json()) as T
}

// Único punto de acceso a la API para toda la aplicación.
export const api = {
  get: <T>(ruta: string) => solicitar<T>('GET', ruta),
  post: <T>(ruta: string, cuerpo?: unknown) => solicitar<T>('POST', ruta, cuerpo),
  put: <T>(ruta: string, cuerpo?: unknown) => solicitar<T>('PUT', ruta, cuerpo),
  patch: <T>(ruta: string, cuerpo?: unknown) => solicitar<T>('PATCH', ruta, cuerpo),
  delete: <T>(ruta: string) => solicitar<T>('DELETE', ruta),
}