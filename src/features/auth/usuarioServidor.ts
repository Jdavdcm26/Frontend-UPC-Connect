import type { EstadoCuenta, Usuario } from '@/features/auth/tipos'

// Forma en que GET /api/v1/me envía al usuario (dentro de { data }).
export type UsuarioServidor = {
  id: number
  name: string
  email: string
  rol: string
  estado: string
}

const ESTADOS: EstadoCuenta[] = ['ACTIVO', 'PENDIENTE', 'SUSPENDIDO']

// Traduce al usuario de la interfaz. Los valores exactos de rol y estado están por confirmar:
// lo que no sea EMPRESA cuenta como candidato, y un estado desconocido como PENDIENTE
// (lo más seguro, porque no deja entrar a rutas protegidas).
export function usuarioDesdeServidor(usuario: UsuarioServidor): Usuario {
  const rol = usuario.rol.toUpperCase()
  const estado = usuario.estado.toUpperCase()
  return {
    id: usuario.id,
    correo: usuario.email,
    rol: rol === 'EMPRESA' ? 'empresa' : 'candidato',
    esEgresado: rol === 'EGRESADO',
    estado: ESTADOS.find((valor) => valor === estado) ?? 'PENDIENTE',
  }
}