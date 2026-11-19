import {
  BriefcaseBusiness,
  ClipboardList,
  House,
  LayoutDashboard,
  Newspaper,
  PlusCircle,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { RUTAS } from '@/shared/lib/rutas'

export type Enlace = {
  ruta: string
  etiqueta: string
  // Icono del menú: refuerza el reconocimiento de la sección activa.
  icono?: LucideIcon
}

// Menú de cada rol (FE-18). Se suma un enlace cuando su pantalla existe, para no dejar
// enlaces que lleven a «página no encontrada».
export const ENLACES_CANDIDATO: Enlace[] = [
  { ruta: RUTAS.inicioCandidato, etiqueta: 'Inicio', icono: House },
  { ruta: RUTAS.publicaciones, etiqueta: 'Publicaciones', icono: Newspaper },
  { ruta: RUTAS.vacantes, etiqueta: 'Vacantes', icono: BriefcaseBusiness },
  { ruta: RUTAS.misPostulaciones, etiqueta: 'Mis postulaciones', icono: ClipboardList },
  { ruta: RUTAS.perfil, etiqueta: 'Mi perfil', icono: UserRound },
]

export const ENLACES_EMPRESA: Enlace[] = [
  { ruta: RUTAS.inicioEmpresa, etiqueta: 'Inicio', icono: LayoutDashboard },
  { ruta: RUTAS.empresaVacantes, etiqueta: 'Mis vacantes', icono: BriefcaseBusiness },
  { ruta: RUTAS.empresaNuevaVacante, etiqueta: 'Publicar vacante', icono: PlusCircle },
  { ruta: RUTAS.publicaciones, etiqueta: 'Publicaciones', icono: Newspaper },
]
