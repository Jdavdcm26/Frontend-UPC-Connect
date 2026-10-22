// Título de cada pantalla (WCAG 2.4.2): el lector de pantalla y las pestañas del navegador lo usan
// para decir dónde está la persona. Cada línea es: patrón de la ruta -> nombre de la pantalla.
const TITULOS: [RegExp, string][] = [
  [/^\/$/, 'Inicio'],
  [/^\/iniciar-sesion$/, 'Iniciar sesión'],
  [/^\/registro$/, 'Crear cuenta'],
  [/^\/revisa-tu-correo$/, 'Revisa tu correo'],
  [/^\/verificar-correo$/, 'Verificar correo'],
  [/^\/recuperar-contrasena$/, 'Recuperar contraseña'],
  [/^\/restablecer-contrasena$/, 'Restablecer contraseña'],
  [/^\/politica-de-privacidad$/, 'Política de privacidad'],
  [/^\/sin-permiso$/, 'Sin permiso'],
  [/^\/cuenta-administrativa$/, 'Cuenta administrativa'],
  [/^\/inicio$/, 'Inicio'],
  [/^\/perfil$/, 'Mi perfil'],
  [/^\/perfil\/editar$/, 'Editar perfil'],
  [/^\/perfiles\/[^/]+$/, 'Perfil'],
  [/^\/vacantes$/, 'Vacantes'],
  [/^\/vacantes\/[^/]+$/, 'Detalle de la vacante'],
  [/^\/mis-postulaciones$/, 'Mis postulaciones'],
  [/^\/empresa$/, 'Inicio de la empresa'],
  [/^\/empresa\/vacantes$/, 'Mis vacantes'],
  [/^\/empresa\/vacantes\/nueva$/, 'Publicar vacante'],
  [/^\/empresa\/vacantes\/[^/]+\/editar$/, 'Editar vacante'],
  [/^\/empresa\/vacantes\/[^/]+\/postulaciones$/, 'Postulaciones recibidas'],
]

const NOMBRE_APP = 'UPC Connect'

// Título de la pestaña para una ruta: «Mi perfil · UPC Connect». Una ruta que no existe es «Página no encontrada».
export function tituloDeRuta(ruta: string): string {
  const limpia = ruta.length > 1 ? ruta.replace(/\/+$/, '') : ruta
  const encontrada = TITULOS.find(([patron]) => patron.test(limpia))
  const nombre = encontrada ? encontrada[1] : 'Página no encontrada'
  return limpia === '/' ? NOMBRE_APP : `${nombre} · ${NOMBRE_APP}`
}
