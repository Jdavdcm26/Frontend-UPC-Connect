import { QueryCache, QueryClient } from '@tanstack/react-query'
import { ApiError } from '@/shared/api/apiError'

// Errores que NO se reintentan: repetir la petición daría el mismo resultado.
const SIN_REINTENTO = [401, 403, 404, 419, 422, 429]

// Mensaje por código HTTP. En FE-09 estos casos cerrarán sesión o redirigirán.
const MENSAJES: Record<number, string> = {
  401: 'Sesión no iniciada',
  403: 'Sin permiso para esta acción',
  419: 'Sesión vencida, inicia sesión de nuevo',
  429: 'Demasiadas peticiones, intenta en unos segundos',
}

// Se ejecuta cuando cualquier consulta falla (manejo global).
function manejarErrorGlobal(error: Error) {
  if (error instanceof ApiError && MENSAJES[error.status]) {
    console.warn(`[api] ${MENSAJES[error.status]} (${error.status})`)
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: manejarErrorGlobal }),
  defaultOptions: {
    queries: {
      // Máximo 2 reintentos, salvo en los errores de la lista anterior.
      retry: (intentos, error) => {
        if (error instanceof ApiError && SIN_REINTENTO.includes(error.status)) {
          return false
        }
        return intentos < 2
      },
    },
  },
})