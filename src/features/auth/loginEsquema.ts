import { z } from 'zod'
import { correo } from '@/shared/lib/validaciones'

// Reglas del formulario de inicio de sesión (FE-12).
// La contraseña solo debe venir escrita: el servidor decide si es correcta.
export const loginEsquema = z.object({
  correo,
  contrasena: z.string().min(1, 'Escribe tu contraseña.'),
})

export type LoginDatos = z.infer<typeof loginEsquema>