// Límites y rangos del perfil (HU-09 / FE-15).
// Valores de GuardarPerfilRequest del backend. Se reemplazan por los del OpenAPI cuando se genere (FE-04).
export const LIMITES = {
  nombre: 80,
  titular: 120,
  descripcion: 1000,
  ciudad: 80,
  interes: 50,
  intereses: 10,
  // Máximo de habilidades por perfil (AgregarHabilidad del backend).
  habilidades: 30,
} as const

export const SEMESTRE_MAX = 12

// El año de grado va desde la fundación de la UPC hasta el año actual (regla del backend).
export const ANIO_GRADO_MIN = 1976