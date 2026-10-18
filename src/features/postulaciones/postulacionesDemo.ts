import type { CambioEstado, CandidatoVisible, Postulacion } from '@/features/postulaciones/tipos'

// Con fixtures, las postulaciones viven en la pestaña (sessionStorage).
const CLAVE_DEMO = 'upc-postulaciones-demo'

// Además de los datos de la postulación, se guarda quién se postuló, su perfil visible y el historial
// de estados (lo usa la empresa en FE-25).
export type PostulacionDemo = Postulacion & {
  candidatoCorreo: string
  candidato: CandidatoVisible
  historial: CambioEstado[]
}

export function leerPostulacionesDemo(): PostulacionDemo[] {
  return JSON.parse(sessionStorage.getItem(CLAVE_DEMO) ?? '[]') as PostulacionDemo[]
}

export function guardarPostulacionesDemo(lista: PostulacionDemo[]): void {
  sessionStorage.setItem(CLAVE_DEMO, JSON.stringify(lista))
}