import { USAR_FIXTURES } from '@/features/auth/sesionApi'
import { perfilDesdeServidor, type PerfilServidor } from '@/features/perfil/conversiones'
import { HABILIDADES_DEMO } from '@/features/perfil/habilidadesDemo'
import { LIMITES } from '@/features/perfil/limites'
import { guardarPerfilDemo, leerPerfilDemo } from '@/features/perfil/perfilApi'
import type { HabilidadCatalogo, NivelHabilidad, Perfil } from '@/features/perfil/tipos'
import { ApiError } from '@/shared/api/apiError'
import { api } from '@/shared/api/client'


const pausa = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

// Sin tildes ni mayúsculas, como busca el servidor.
const normalizar = (texto: string) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()

// Sugerencias del catálogo (API-11). El servidor ignora tildes y mayúsculas, pone primero las que
// empiezan por el texto y devuelve como máximo 20.
export async function buscarHabilidades(texto: string): Promise<HabilidadCatalogo[]> {
  if (USAR_FIXTURES) {
    await pausa(250)
    const buscado = normalizar(texto)
    return HABILIDADES_DEMO.filter((h) => normalizar(h.nombre).includes(buscado))
      .sort((a, b) => Number(!normalizar(a.nombre).startsWith(buscado)) - Number(!normalizar(b.nombre).startsWith(buscado)))
      .slice(0, 20)
  }
  const respuesta = await api.get<{ data: HabilidadCatalogo[] }>(`/api/v1/habilidades?q=${encodeURIComponent(texto)}`)
  return respuesta.data
}

// Errores de validación que el servidor da en habilidad_id, con el mismo texto.
function rechazar(mensaje: string): never {
  throw new ApiError(422, mensaje, { habilidad_id: [mensaje] })
}

// Agrega una habilidad del catálogo al perfil (API-14). Responde con el perfil actualizado.
// El nivel es opcional. Sin duplicados y hasta 30 por perfil.
export async function agregarHabilidad(habilidad: HabilidadCatalogo, nivel: NivelHabilidad | null): Promise<Perfil> {
  if (USAR_FIXTURES) {
    await pausa(300)
    const perfil = leerPerfilDemo()
    if (!perfil) throw new ApiError(404, 'Aún no has creado tu perfil. Complétalo para continuar.')
    if (perfil.habilidades.some((h) => h.id === habilidad.id)) rechazar('Ya tienes esta habilidad en tu perfil.')
    if (perfil.habilidades.length >= LIMITES.habilidades) {
      rechazar(`Puedes tener hasta ${LIMITES.habilidades} habilidades. Quita alguna para agregar otra.`)
    }
    const nuevo = { ...perfil, habilidades: [...perfil.habilidades, { ...habilidad, nivel }] }
    guardarPerfilDemo(nuevo)
    return nuevo
  }
  const respuesta = await api.post<{ data: PerfilServidor }>('/api/v1/me/perfil/habilidades', {
    habilidad_id: habilidad.id,
    ...(nivel ? { nivel } : {}),
  })
  return perfilDesdeServidor(respuesta.data)
}

// Quita una habilidad del perfil (API-15). Quitar una que no está no es un error. Responde con el perfil actualizado.
export async function quitarHabilidad(habilidadId: string): Promise<Perfil> {
  if (USAR_FIXTURES) {
    await pausa(300)
    const perfil = leerPerfilDemo()
    if (!perfil) throw new ApiError(404, 'Aún no has creado tu perfil. Complétalo para continuar.')
    const nuevo = { ...perfil, habilidades: perfil.habilidades.filter((h) => h.id !== habilidadId) }
    guardarPerfilDemo(nuevo)
    return nuevo
  }
  const respuesta = await api.delete<{ data: PerfilServidor }>(`/api/v1/me/perfil/habilidades/${encodeURIComponent(habilidadId)}`)
  return perfilDesdeServidor(respuesta.data)
}
