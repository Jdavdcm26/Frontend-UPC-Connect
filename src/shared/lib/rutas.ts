// Todas las rutas de la aplicación en un solo lugar (en español, RNF-27).
// Si hay que renombrar una, se cambia aquí y se actualiza en todas partes.
export const RUTAS = {
  raiz: '/', // redirige según el rol de la persona
  registro: '/registro',
  verificarCorreo: '/verificar-correo',
  iniciarSesion: '/iniciar-sesion',
  recuperarContrasena: '/recuperar-contrasena',
  restablecerContrasena: '/restablecer-contrasena',
  politicaPrivacidad: '/politica-de-privacidad',
  inicioCandidato: '/inicio',
  inicioEmpresa: '/empresa',
  sinPermiso: '/sin-permiso',
} as const