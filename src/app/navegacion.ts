import { RUTAS } from '@/shared/lib/rutas'

export type Enlace = {
  ruta: string
  etiqueta: string
}

// Menú de cada rol (FE-18). Se suma un enlace cuando su pantalla existe, para no dejar
// enlaces que lleven a «página no encontrada». Pendiente: Mis postulaciones (candidato).
export const ENLACES_CANDIDATO: Enlace[] = [
  { ruta: RUTAS.inicioCandidato, etiqueta: 'Inicio' },
  { ruta: RUTAS.vacantes, etiqueta: 'Vacantes' },
  { ruta: RUTAS.perfil, etiqueta: 'Mi perfil' },
]

export const ENLACES_EMPRESA: Enlace[] = [
  { ruta: RUTAS.inicioEmpresa, etiqueta: 'Inicio' },
  { ruta: RUTAS.empresaVacantes, etiqueta: 'Mis vacantes' },
  { ruta: RUTAS.empresaNuevaVacante, etiqueta: 'Publicar vacante' },
]