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
  // Nombre de la carrera: el servidor lo envía aunque la carrera ya no esté en el catálogo.
  carreraNombre: string
  // Los egresados no tienen semestre.
  semestre: number | null
  // Solo para egresados.
  anioGrado: number | null
  ciudad: string
  intereses: string[]
}

// Tipo y nivel de una habilidad (catálogo de habilidades del servidor).
export type TipoHabilidad = 'TECNICA' | 'BLANDA' | 'IDIOMA'
export type NivelHabilidad = 'BASICO' | 'INTERMEDIO' | 'AVANZADO'

// Habilidad de un perfil. El nivel puede no haberse indicado.
export type HabilidadPerfil = {
  id: string
  nombre: string
  tipo: TipoHabilidad
  nivel: NivelHabilidad | null
}

// Perfil de otra persona (HU-27 / FE-26). Todos los datos llegan siempre: lo que no tiene valor
// queda como texto vacío o lista vacía, y la pantalla omite esas secciones.
export type PerfilPublico = {
  slug: string
  nombres: string
  apellidos: string
  titular: string
  // Vacío si la carrera ya no existe.
  carreraNombre: string
  semestre: number | null
  anioGrado: number | null
  ciudad: string
  descripcion: string
  intereses: string[]
  habilidades: HabilidadPerfil[]
}
