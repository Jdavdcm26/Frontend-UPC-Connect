import { z } from 'zod'

// Validaciones reutilizables para todos los formularios (mensajes en español, RNF-27).

export const correo = z.email('Escribe un correo válido, por ejemplo nombre@dominio.com.')

export const contrasena = z
  .string()
  .min(10, 'La contraseña debe tener al menos 10 caracteres.')

// Texto obligatorio con longitud máxima. "campo" es el nombre que verá la persona.
export const textoObligatorio = (campo: string, max = 120) =>
  z
    .string()
    .trim()
    .min(1, `El campo ${campo} es obligatorio.`)
    .max(max, `El campo ${campo} admite máximo ${max} caracteres.`)

// URL opcional: se acepta vacío o una dirección válida.
export const urlOpcional = z.union([z.literal(''), z.url('Escribe una dirección válida, por ejemplo https://ejemplo.com.')])

// Fecha escrita como texto (ej. 2026-10-17).
export const fecha = z
  .string()
  .refine((valor) => !Number.isNaN(Date.parse(valor)), 'Escribe una fecha válida.')