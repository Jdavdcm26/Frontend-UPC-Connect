import { z } from 'zod'
import { LIMITES_VACANTE } from '@/features/vacantes/limites'
import { MODALIDADES, TIPOS_VACANTE } from '@/features/vacantes/tipos'
import { hoyLocal } from '@/shared/lib/fechas'
import { textoObligatorio } from '@/shared/lib/validaciones'

// Reglas del formulario de vacante (HU-41 / FE-19). La decisión final es del servidor.
export const vacanteEsquema = z.object({
  tipo: z.enum(TIPOS_VACANTE, 'Elige el tipo de oferta.'),
  titulo: textoObligatorio('título', LIMITES_VACANTE.titulo),
  descripcion: textoObligatorio('descripción', LIMITES_VACANTE.descripcion),
  requisitos: textoObligatorio('requisitos', LIMITES_VACANTE.requisitos),
  // Identificadores de carrera como texto, porque vienen de casillas de verificación.
  carreraIds: z.array(z.string()).min(1, 'Elige al menos una carrera objetivo.'),
  ciudad: textoObligatorio('ciudad', LIMITES_VACANTE.ciudad),
  modalidad: z.enum(MODALIDADES, 'Elige la modalidad.'),
  // Texto AAAA-MM-DD; no puede ser anterior a hoy.
  fechaCierre: z
    .string()
    .min(1, 'Escribe la fecha de cierre.')
    .refine((valor) => !Number.isNaN(Date.parse(valor)), 'Escribe una fecha válida.')
    .refine((valor) => valor >= hoyLocal(), 'La fecha de cierre no puede ser anterior a hoy.'),
})

export type VacanteDatos = z.infer<typeof vacanteEsquema>