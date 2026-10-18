import type { EstadoCuenta, Rol, Usuario } from '@/features/auth/tipos'

// Forma en que GET /api/v1/me envía al usuario (dentro de { data }).
export type UsuarioServidor = {
  id: string
  name: string
  email: string
  rol: string
  estado: string
  // Solo viene en empresas.
  empresa_aprobada?: boolean | null
}

const ESTADOS: EstadoCuenta[] = ['ACTIVO', 'PENDIENTE', 'SUSPENDIDO']

// Roles del servidor: ESTUDIANTE, EGRESADO, EMPRESA, MODERADOR y ADMIN.
// ESTUDIANTE y EGRESADO son candidato; cualquier otro valor se trata como candidato.
function rolDeLaInterfaz(rol: string): Rol {
  if (rol === 'EMPRESA') return 'empresa'
  if (rol === 'ADMIN') return 'admin'
  if (rol === 'MODERADOR') return 'moderador'
  return 'candidato'
}

// Traduce al usuario de la interfaz. Un estado desconocido cuenta como PENDIENTE
// (lo más seguro, porque no deja entrar a rutas protegidas).
export function usuarioDesdeServidor(usuario: UsuarioServidor): Usuario {
  const rol = usuario.rol.toUpperCase()
  const estado = usuario.estado.toUpperCase()
  return {
    id: usuario.id,
    correo: usuario.email,
    rol: rolDeLaInterfaz(rol),
    esEgresado: rol === 'EGRESADO',
    estado: ESTADOS.find((valor) => valor === estado) ?? 'PENDIENTE',
    ...(rol === 'EMPRESA' && typeof usuario.empresa_aprobada === 'boolean'
      ? { empresaAprobada: usuario.empresa_aprobada }
      : {}),
  }
}