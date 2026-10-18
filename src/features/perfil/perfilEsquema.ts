import { z } from 'zod'
import { LIMITES, SEMESTRE_MAX } from '@/features/perfil/limites'
import { textoObligatorio } from '@/shared/lib/validaciones'

// Reglas del formulario de perfil (HU-09 / FE-15).
// Los valores del formulario son texto; se convierten a número al enviar.
export const perfilEsquema = z.object({
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
  semestre: z
    .string()
    .min(1, 'Elige tu semestre.')
    .refine(
      (valor) => Number.isInteger(Number(valor)) && Number(valor) >= 1 && Number(valor) <= SEMESTRE_MAX,
      `El semestre debe estar entre 1 y ${SEMESTRE_MAX}.`,
    ),
  // Vacío para estudiantes; un año de cuatro cifras para egresados.
  anioGrado: z
    .string()
    .refine((valor) => valor === '' || /^\d{4}$/.test(valor), 'Escribe un año válido, por ejemplo 2025.'),
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
})

export type PerfilDatos = z.infer<typeof perfilEsquema>