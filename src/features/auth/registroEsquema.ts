import { z } from 'zod'
import { contrasena, correo } from '@/shared/lib/validaciones'

// Reglas del formulario de registro (FE-10).
export const registroEsquema = z
  .object({
    correo,
    contrasena,
    confirmacion: z.string().min(1, 'Confirma tu contraseña.'),
  })
  .refine((datos) => datos.contrasena === datos.confirmacion, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmacion'],
  })

export type RegistroDatos = z.infer<typeof registroEsquema>