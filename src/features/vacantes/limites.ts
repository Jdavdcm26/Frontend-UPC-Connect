// Límites del formulario de vacante (HU-41 / FE-19).
// Valores de GuardarVacanteRequest del backend. Se reemplazan por los del OpenAPI cuando se genere (FE-04).
export const LIMITES_VACANTE = {
  titulo: 150,
  descripcion: 5000,
  requisitos: 3000,
  ciudad: 80,
  carreras: 20,
} as const