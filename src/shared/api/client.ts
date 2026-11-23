import { ApiError } from '@/shared/api/apiError'

// Dirección base de la API (variable de entorno definida en Vercel).
const BASE_URL: string = import.meta.env.VITE_API_URL ?? ''

export const CLAVE_TOKEN = 'token'

export function guardarToken(token: string): void {
  localStorage.setItem(CLAVE_TOKEN, token)
}

export function borrarToken(): void {
  localStorage.removeItem(CLAVE_TOKEN)
}

export function leerToken(): string | null {
  return localStorage.getItem(CLAVE_TOKEN)
}

type Metodo = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

// Mensajes en español de Colombia que dicen cómo corregir (RNF-27).
// Tienen prioridad sobre el texto del servidor (en 401, 403 y 404 viene en inglés).
const MENSAJES: Record<number, string> = {
  401: 'Debes iniciar sesión para continuar.',
  403: 'No tienes permiso para realizar esta acción.',
  404: 'No encontramos lo que buscas.',
  422: 'Revisa los datos del formulario.',
  429: 'Demasiadas peticiones. Intenta de nuevo en unos segundos.',
}

// El token dejó de ser válido y SessionProvider necesita enterarse sin caché global.
let alSesionExpirada: (() => void) | null = null
export function configurarSesionExpirada(fn: (() => void) | null): void {
  alSesionExpirada = fn
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
  // Un FormData (archivos) viaja tal cual: el navegador pone el Content-Type multipart con su «boundary».
  // Cualquier otro cuerpo viaja como JSON.
  const esFormulario = cuerpo instanceof FormData
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (cuerpo !== undefined && !esFormulario) headers['Content-Type'] = 'application/json'

  const token = leerToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  let respuesta: Response
  try {
    respuesta = await fetch(`${BASE_URL}${ruta}`, {
      method: metodo,
      headers,
      body: esFormulario ? cuerpo : cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined,
    })
  } catch {
    throw new ApiError(0, 'No hay conexión con el servidor. Revisa tu internet.')
  }

  if (!respuesta.ok) {
    // 401: el token ya no sirve. Se descarta y se avisa para pasar a "sin sesión".
    if (respuesta.status === 401) {
      borrarToken()
      alSesionExpirada?.()
    }
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
  // Envía archivos (por ejemplo, imágenes) como multipart/form-data, con el mismo token y manejo de errores.
  // Solo POST: PHP no lee archivos que llegan en un PUT o PATCH multipart.
  postFormulario: <T>(ruta: string, formulario: FormData) => solicitar<T>('POST', ruta, formulario),
}
