import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { CLAVE_SESION } from '@/features/auth/sesionApi'
import { ApiError } from '@/shared/api/apiError'

// Errores que NO se reintentan: repetir la petición daría el mismo resultado.
const SIN_REINTENTO = [401, 403, 404, 419, 422, 429]

// Se ejecuta cuando cualquier consulta o acción falla (manejo global).
// 401 y 419 significan que la sesión venció: se marca como cerrada y RequireAuth
// lleva a iniciar sesión guardando la ruta de destino (FE-09).
function manejarErrorGlobal(error: Error) {
  if (!(error instanceof ApiError)) return
  if (error.status === 401 || error.status === 419) {
    queryClient.setQueryData(CLAVE_SESION, null)
  } else if (error.status === 403 || error.status === 429) {
    console.warn(`[api] ${error.message} (${error.status})`)
  }
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: manejarErrorGlobal }),
  mutationCache: new MutationCache({ onError: manejarErrorGlobal }),
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