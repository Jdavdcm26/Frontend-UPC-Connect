// Límites y rangos del perfil (HU-09 / FE-15).
// PROVISIONALES: el roadmap pide tomarlos del esquema OpenAPI cuando José lo publique.
export const LIMITES = {
  nombre: 80,
  titular: 120,
  descripcion: 1000,
  ciudad: 80,
  interes: 40,
  intereses: 10,
} as const

export const SEMESTRE_MAX = 12