import type { Rol } from '@/features/auth/tipos'
import { RUTAS } from '@/shared/lib/rutas'

// Página de inicio de cada rol (HU-03).
export function rutaInicioPorRol(rol: Rol): string {
  return rol === 'empresa' ? RUTAS.inicioEmpresa : RUTAS.inicioCandidato
}