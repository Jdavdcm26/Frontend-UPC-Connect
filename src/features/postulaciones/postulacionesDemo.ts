import type { Postulacion } from '@/features/postulaciones/tipos'

// Con fixtures, las postulaciones viven en la pestaña (sessionStorage).
const CLAVE_DEMO = 'upc-postulaciones-demo'

// Además de los datos de la postulación, se guarda quién se postuló (lo usa la empresa en FE-25).
export type PostulacionDemo = Postulacion & { candidatoCorreo: string }

export function leerPostulacionesDemo(): PostulacionDemo[] {
  return JSON.parse(sessionStorage.getItem(CLAVE_DEMO) ?? '[]') as PostulacionDemo[]
}

export function guardarPostulacionesDemo(lista: PostulacionDemo[]): void {
  sessionStorage.setItem(CLAVE_DEMO, JSON.stringify(lista))
}