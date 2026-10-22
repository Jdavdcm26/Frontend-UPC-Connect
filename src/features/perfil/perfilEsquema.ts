import { z } from 'zod'
import { ANIO_GRADO_MIN, LIMITES, SEMESTRE_MAX } from '@/features/perfil/limites'
import { textoObligatorio } from '@/shared/lib/validaciones'

// Campos que comparten estudiantes y egresados.
const camposComunes = {
  nombres: textoObligatorio('nombres', LIMITES.nombre),
  apellidos: textoObligatorio('apellidos', LIMITES.nombre),
  titular: z
    .string()
    .trim()
    .max(LIMITES.titular, `El titular admite máximo ${LIMITES.titular} caracteres.`),
  descripcion: z
    .string()
    .trim()
    .max(LIMITES.descripcion, `La descripción admite máximo ${LIMITES.descripcion} caracteres.`),
  carreraId: z.string().min(1, 'Elige tu carrera.'),
  ciudad: z.string().trim().max(LIMITES.ciudad, `La ciudad admite máximo ${LIMITES.ciudad} caracteres.`),
  intereses: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .max(LIMITES.interes, `Cada interés admite máximo ${LIMITES.interes} caracteres.`),
    )
    .max(LIMITES.intereses, `Puedes agregar máximo ${LIMITES.intereses} intereses.`),
}

// Reglas del formulario de perfil (HU-09 / FE-15). Los valores del formulario son texto;
// se convierten a número al enviar. Un estudiante elige su semestre y no tiene año de grado.
const perfilEsquemaEstudiante = z.object({
  ...camposComunes,
  semestre: z
    .string()
    .min(1, 'Elige tu semestre.')
    .refine(
      (valor) => Number.isInteger(Number(valor)) && Number(valor) >= 1 && Number(valor) <= SEMESTRE_MAX,
      `El semestre debe estar entre 1 y ${SEMESTRE_MAX}.`,
    ),
  anioGrado: z.string(),
})

// Un egresado escribe su año de grado y no tiene semestre (el servidor lo rechaza).
const perfilEsquemaEgresado = z.object({
  ...camposComunes,
  semestre: z.string(),
  anioGrado: z
    .string()
    .min(1, 'Escribe tu año de grado.')
    .refine(
      (valor) => /^\d{4}$/.test(valor) && Number(valor) >= ANIO_GRADO_MIN && Number(valor) <= new Date().getFullYear(),
      `El año de grado debe estar entre ${ANIO_GRADO_MIN} y ${new Date().getFullYear()}.`,
    ),
})

// Esquema que corresponde a la persona: egresado o estudiante.
export function esquemaPerfil(esEgresado: boolean) {
  return esEgresado ? perfilEsquemaEgresado : perfilEsquemaEstudiante
}

export type PerfilDatos = z.infer<typeof perfilEsquemaEstudiante>