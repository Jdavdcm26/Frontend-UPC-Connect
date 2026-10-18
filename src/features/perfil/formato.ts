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