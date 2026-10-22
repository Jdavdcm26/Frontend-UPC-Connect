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
  publicaciones: '/publicaciones',
  nuevaPublicacion: '/publicaciones/nueva',
  bloqueados: '/bloqueados',
  sinPermiso: '/sin-permiso',
  cuentaAdministrativa: '/cuenta-administrativa',
  // Panel de administración (Filament). Lo sirve el backend, no es una ruta de esta aplicación.
  panelAdministracion: '/admin',
} as const

// Ruta para editar una vacante de la empresa.
export const rutaEditarVacante = (id: string) => `/empresa/vacantes/${id}/editar`

// Ruta con las postulaciones que recibió una vacante de la empresa.
export const rutaPostulacionesVacante = (id: string) => `/empresa/vacantes/${id}/postulaciones`

// Ruta con el perfil de otra persona (HU-27 / FE-26). El slug lo genera el servidor.
export const rutaPerfilPublico = (slug: string) => `/perfiles/${encodeURIComponent(slug)}`

// Detalle de una publicación de la comunidad (HU-18).
export const rutaPublicacion = (id: string) => `/publicaciones/${encodeURIComponent(id)}`

// Editar una publicación propia (HU-22).
export const rutaEditarPublicacion = (id: string) => `/publicaciones/${encodeURIComponent(id)}/editar`
