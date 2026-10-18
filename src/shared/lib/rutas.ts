// Rutas de la app en español (RNF-27). Se usan desde un solo lugar.
export const RUTAS = {
  raiz: '/',
  registro: '/registro',
  revisaCorreo: '/revisa-tu-correo',
  verificarCorreo: '/verificar-correo',
  iniciarSesion: '/iniciar-sesion',
  recuperarContrasena: '/recuperar-contrasena',
  restablecerContrasena: '/restablecer-contrasena',
  politicaPrivacidad: '/politica-de-privacidad',
  inicioCandidato: '/inicio',
  inicioEmpresa: '/empresa',
  empresaVacantes: '/empresa/vacantes',
  empresaNuevaVacante: '/empresa/vacantes/nueva',
  vacantes: '/vacantes',
  misPostulaciones: '/mis-postulaciones',
  perfil: '/perfil',
  perfilEditar: '/perfil/editar',
  sinPermiso: '/sin-permiso',
  cuentaAdministrativa: '/cuenta-administrativa',
  // Panel de administración (Filament). Lo sirve el backend, no es una ruta de esta aplicación.
  panelAdministracion: '/admin',
} as const

// Ruta para editar una vacante de la empresa.
export const rutaEditarVacante = (id: string) => `/empresa/vacantes/${id}/editar`

// Ruta con las postulaciones que recibió una vacante de la empresa.
export const rutaPostulacionesVacante = (id: string) => `/empresa/vacantes/${id}/postulaciones`