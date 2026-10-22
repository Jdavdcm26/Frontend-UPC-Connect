import type { CuentaBloqueada, RedPerfil, RedPropia, RolBloqueado } from '@/features/red/tipos'

// Bloque «red» que acompaña a GET /perfiles/{slug}.
export type RedPerfilServidor = {
  usuario_id: string
  seguidores: number
  seguidos: number
  lo_sigues: boolean
  lo_bloqueaste: boolean
}

// Bloque «red» que acompaña a GET /me/perfil.
export type RedPropiaServidor = {
  seguidores: number
  seguidos: number
}

// Cuenta bloqueada (UsuarioBloqueadoResource).
export type CuentaBloqueadaServidor = {
  id: string
  nombre: string
  rol: RolBloqueado
  slug: string | null
  bloqueado_en: string
}

export function redPerfilDesdeServidor(r: RedPerfilServidor): RedPerfil {
  return {
    usuarioId: r.usuario_id,
    seguidores: r.seguidores,
    seguidos: r.seguidos,
    loSigues: r.lo_sigues,
    loBloqueaste: r.lo_bloqueaste,
  }
}

// Sin el bloque (por ejemplo, con datos de prueba) los contadores quedan en cero.
export function redPropiaDesdeServidor(r: RedPropiaServidor | undefined): RedPropia {
  return { seguidores: r?.seguidores ?? 0, seguidos: r?.seguidos ?? 0 }
}

export function cuentaBloqueadaDesdeServidor(c: CuentaBloqueadaServidor): CuentaBloqueada {
  return { id: c.id, nombre: c.nombre, rol: c.rol, slug: c.slug, bloqueadaEn: c.bloqueado_en }
}

// «1 seguidor», «3 seguidores», «0 seguidos».
export function textoContador(cantidad: number, singular: string, plural: string): string {
  return `${cantidad} ${cantidad === 1 ? singular : plural}`
}
