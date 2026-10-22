import { cuentaBloqueadaDesdeServidor, type CuentaBloqueadaServidor } from '@/features/red/conversiones'
import type { CuentaBloqueada } from '@/features/red/tipos'
import { api } from '@/shared/api/client'

const rutaUsuario = (usuarioId: string) => `/api/v1/usuarios/${encodeURIComponent(usuarioId)}`

// Seguir o dejar de seguir (HU-28). Repetir no es un error; devuelve el total de seguidores actualizado.
export async function seguir(usuarioId: string, seguir: boolean): Promise<{ siguiendo: boolean; seguidores: number }> {
  const ruta = `${rutaUsuario(usuarioId)}/seguimiento`
  const respuesta = seguir
    ? await api.post<{ data: { siguiendo: boolean; seguidores: number } }>(ruta)
    : await api.delete<{ data: { siguiendo: boolean; seguidores: number } }>(ruta)
  return respuesta.data
}

// Bloquear o desbloquear (HU-31). Bloquear deshace el seguimiento en las dos direcciones.
export async function bloquear(usuarioId: string, bloquear: boolean): Promise<void> {
  const ruta = `${rutaUsuario(usuarioId)}/bloqueo`
  if (bloquear) await api.post(ruta)
  else await api.delete(ruta)
}

// Cuentas que la persona bloqueó, las más recientes primero.
export async function listarBloqueados(): Promise<CuentaBloqueada[]> {
  const respuesta = await api.get<{ data: CuentaBloqueadaServidor[] }>('/api/v1/me/bloqueados')
  return respuesta.data.map(cuentaBloqueadaDesdeServidor)
}
