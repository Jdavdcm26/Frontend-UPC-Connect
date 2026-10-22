import { z } from 'zod'
import { LIMITES_PUBLICACION } from '@/features/publicaciones/limites'
import { TIPOS_PUBLICACION } from '@/features/publicaciones/tipos'
import { MODALIDADES } from '@/features/vacantes/tipos'
import { textoObligatorio } from '@/shared/lib/validaciones'

const L = LIMITES_PUBLICACION

// Reglas de los campos de la plantilla. Solo se revisan los del tipo elegido.
const REGLAS_SERVICIO = {
  area: textoObligatorio('área', L.area),
  disponibilidad: textoObligatorio('disponibilidad', L.disponibilidad),
}
const REGLAS_EQUIPO = {
  proyecto: textoObligatorio('proyecto', L.proyecto),
  perfilesRequeridos: textoObligatorio('perfiles requeridos', L.perfilesRequeridos),
}

// Formulario de publicar o editar (HU-18 a HU-20, HU-22). Los campos de la plantilla viven todos
// en el formulario como texto, y cada tipo exige solo los suyos. La decisión final es del servidor.
export const publicacionEsquema = z
  .object({
    tipo: z.enum(TIPOS_PUBLICACION, 'Elige el tipo de publicación.'),
    categoriaId: z.string().min(1, 'Elige una categoría.'),
    contenido: textoObligatorio('contenido', L.contenido),
    area: z.string(),
    modalidad: z.union([z.enum(MODALIDADES), z.literal('')]),
    disponibilidad: z.string(),
    proyecto: z.string(),
    perfilesRequeridos: z.string(),
    // Texto, porque viene de un campo numérico del formulario.
    cupos: z.string(),
  })
  .superRefine((datos, ctx) => {
    // Cada regla de texto dice su propio mensaje; aquí solo se lleva al campo que corresponde.
    const revisar = (reglas: Record<string, z.ZodType>) => {
      for (const [campo, regla] of Object.entries(reglas)) {
        const resultado = regla.safeParse(datos[campo as keyof typeof datos])
        if (!resultado.success) {
          ctx.addIssue({ code: 'custom', path: [campo], message: resultado.error.issues[0].message })
        }
      }
    }

    if (datos.tipo === 'SERVICIO') {
      revisar(REGLAS_SERVICIO)
      if (datos.modalidad === '') {
        ctx.addIssue({ code: 'custom', path: ['modalidad'], message: 'Elige la modalidad.' })
      }
    }

    if (datos.tipo === 'BUSQUEDA_EQUIPO') {
      revisar(REGLAS_EQUIPO)
      const cupos = Number(datos.cupos)
      if (datos.cupos.trim() === '' || !Number.isInteger(cupos) || cupos < L.cuposMinimo || cupos > L.cuposMaximo) {
        ctx.addIssue({
          code: 'custom',
          path: ['cupos'],
          message: `Escribe un número de cupos entre ${L.cuposMinimo} y ${L.cuposMaximo}.`,
        })
      }
    }
  })

export type PublicacionDatos = z.infer<typeof publicacionEsquema>

// Comentario nuevo o editado (HU-26).
export const comentarioEsquema = z.object({
  contenido: textoObligatorio('comentario', L.comentario),
})

export type ComentarioDatos = z.infer<typeof comentarioEsquema>
