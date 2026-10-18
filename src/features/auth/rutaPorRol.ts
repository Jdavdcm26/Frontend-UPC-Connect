import type { Rol } from '@/features/auth/tipos'
import { RUTAS } from '@/shared/lib/rutas'

// Página de inicio de cada rol (HU-03). Moderador y admin no tienen pantallas propias:
// van a un aviso que les explica dónde se gestiona su cuenta.
export function rutaInicioPorRol(rol: Rol): string {
  if (rol === 'empresa') return RUTAS.inicioEmpresa
  if (rol === 'admin' || rol === 'moderador') return RUTAS.cuentaAdministrativa
  return RUTAS.inicioCandidato
}

// Zonas exclusivas y los roles que pueden entrar a cada una:
// /empresa es de empresas; /inicio, /vacantes, /mis-postulaciones y /perfil, de candidatos;
// /cuenta-administrativa, de admin y moderador.
function rolesDeLaRuta(ruta: string): Rol[] | null {
  const esZona = (prefijo: string) =>
    ruta === prefijo || ruta.startsWith(`${prefijo}/`) || ruta.startsWith(`${prefijo}?`)
  if (esZona(RUTAS.inicioEmpresa)) return ['empresa']
  const zonasCandidato = [RUTAS.inicioCandidato, RUTAS.vacantes, RUTAS.misPostulaciones, RUTAS.perfil]
  if (zonasCandidato.some(esZona)) return ['candidato']
  if (esZona(RUTAS.cuentaAdministrativa)) return ['admin', 'moderador']
  return null
}

// Tras iniciar sesión solo se vuelve a la ruta guardada si esa persona puede entrar a ella.
// Si no, devuelve null y se usa la página de inicio de su rol.
export function destinoPermitido(ruta: string | null, rol: Rol): string | null {
  if (!ruta) return null
  const permitidos = rolesDeLaRuta(ruta)
  return permitidos === null || permitidos.includes(rol) ? ruta : null
}