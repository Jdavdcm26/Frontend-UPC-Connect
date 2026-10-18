import { z } from 'zod'
import { contrasena, correo } from '@/shared/lib/validaciones'

// Pedir el enlace de recuperación (HU-02 / FE-13).
export const solicitarRecuperacionEsquema = z.object({ correo })
export type SolicitarRecuperacionDatos = z.infer<typeof solicitarRecuperacionEsquema>

// Escribir la contraseña nueva, llegando desde el enlace del correo.
export const restablecerEsquema = z
  .object({
    contrasena,
    confirmacion: z.string().min(1, 'Confirma tu contraseña.'),
  })
  .refine((datos) => datos.contrasena === datos.confirmacion, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmacion'],
  })
export type RestablecerDatos = z.infer<typeof restablecerEsquema>