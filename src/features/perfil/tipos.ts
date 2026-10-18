// Programa académico del catálogo (GET /api/v1/carreras).
// Una carrera desactivada sigue visible en perfiles existentes, pero no se ofrece en altas nuevas.
export type Carrera = {
  id: string
  nombre: string
  facultad: string
  activa: boolean
}

// Perfil profesional básico de estudiantes y egresados.
export type Perfil = {
  nombres: string
  apellidos: string
  titular: string
  descripcion: string
  carreraId: string
  semestre: number
  // Solo para egresados.
  anioGrado: number | null
  ciudad: string
  intereses: string[]
}