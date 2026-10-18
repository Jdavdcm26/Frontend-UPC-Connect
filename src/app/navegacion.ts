import { RUTAS } from '@/shared/lib/rutas'

export type Enlace = {
  ruta: string
  etiqueta: string
}

// Menú de cada rol (FE-18). Se suma un enlace cuando su pantalla existe, para no dejar
// enlaces que lleven a «página no encontrada». Pendientes: Vacantes y Mis postulaciones
// (candidato); Mis vacantes (empresa).
export const ENLACES_CANDIDATO: Enlace[] = [
  { ruta: RUTAS.inicioCandidato, etiqueta: 'Inicio' },
  { ruta: RUTAS.perfil, etiqueta: 'Mi perfil' },
]

export const ENLACES_EMPRESA: Enlace[] = [
  { ruta: RUTAS.inicioEmpresa, etiqueta: 'Inicio' },
  { ruta: RUTAS.empresaNuevaVacante, etiqueta: 'Publicar vacante' },
]