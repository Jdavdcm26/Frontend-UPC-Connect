import { z } from 'zod'
import { LIMITES_POSTULACION } from '@/features/postulaciones/limites'

// Reglas del formulario para postularse (HU-45 / FE-23). El mensaje es opcional.
export const postulacionEsquema = z.object({
  mensaje: z
    .string()
    .trim()
    .max(LIMITES_POSTULACION.mensaje, `El mensaje admite máximo ${LIMITES_POSTULACION.mensaje} caracteres.`),
})

export type PostulacionDatos = z.infer<typeof postulacionEsquema>