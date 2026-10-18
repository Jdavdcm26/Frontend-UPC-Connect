import type { Rol } from '@/features/auth/tipos'
import { RUTAS } from '@/shared/lib/rutas'

// Página de inicio de cada rol (HU-03). Moderador y admin no tienen pantallas propias:
// van a un aviso que les explica dónde se gestiona su cuenta.
export function rutaInicioPorRol(rol: Rol): string {
  if (rol === 'empresa') return RUTAS.inicioEmpresa
  if (rol === 'admin' || rol === 'moderador') return RUTAS.cuentaAdministrativa
  return RUTAS.inicioCandidato
}

// Zonas exclusivas de un rol: /empresa es de empresas; /inicio, /vacantes y /perfil, de candidatos.
function rolDeLaRuta(ruta: string): Rol | null {
  const esZona = (prefijo: string) =>
    ruta === prefijo || ruta.startsWith(`${prefijo}/`) || ruta.startsWith(`${prefijo}?`)
  if (esZona(RUTAS.inicioEmpresa)) return 'empresa'
  if (esZona(RUTAS.inicioCandidato) || esZona(RUTAS.vacantes) || esZona(RUTAS.perfil)) return 'candidato'
  return null
}

// Tras iniciar sesión solo se vuelve a la ruta guardada si esa persona puede entrar a ella.
// Si no, devuelve null y se usa la página de inicio de su rol.
export function destinoPermitido(ruta: string | null, rol: Rol): string | null {
  if (!ruta) return null
  const duenio = rolDeLaRuta(ruta)
  return duenio === null || duenio === rol ? ruta : null
}