import type { NivelHabilidad } from '@/features/perfil/tipos'

type DatosAcademicos = {
  carrera: string
  // Los egresados no tienen semestre.
  semestre: number | null
  // Solo para egresados.
  anioGrado: number | null
}

// Resumen para mostrar, por ejemplo «Ingeniería de Sistemas · Semestre 6» o
// «Ingeniería de Sistemas · Egresado en 2025».
export function resumenAcademico({ carrera, semestre, anioGrado }: DatosAcademicos): string {
  return [
    carrera,
    semestre === null ? null : `Semestre ${semestre}`,
    anioGrado === null ? null : `Egresado en ${anioGrado}`,
  ]
    .filter(Boolean)
    .join(' · ')
}

// Identificador para la dirección del perfil, como el que genera el servidor:
// «Ana Pérez» queda «ana-perez». Solo lo usan los datos de prueba.
export function slugDesdeNombre(nombres: string, apellidos: string): string {
  return `${nombres} ${apellidos}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}


const ETIQUETAS_NIVEL: Record<NivelHabilidad, string> = {
  BASICO: 'Básico',
  INTERMEDIO: 'Intermedio',
  AVANZADO: 'Avanzado',
}

// Nivel de una habilidad para mostrar: «Avanzado».
export function etiquetaNivel(nivel: NivelHabilidad): string {
  return ETIQUETAS_NIVEL[nivel]
}
