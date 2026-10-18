import { z } from 'zod'
import { contrasena, correo } from '@/shared/lib/validaciones'

// Reglas del formulario de registro (FE-10 y FE-14).
export const registroEsquema = z
  .object({
    correo,
    contrasena,
    confirmacion: z.string().min(1, 'Confirma tu contraseña.'),
    // Consentimiento obligatorio (HU-07).
    aceptaPolitica: z
      .boolean()
      .refine((valor) => valor, 'Debes aceptar la política de privacidad para registrarte.'),
  })
  .refine((datos) => datos.contrasena === datos.confirmacion, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmacion'],
  })

export type RegistroDatos = z.infer<typeof registroEsquema>