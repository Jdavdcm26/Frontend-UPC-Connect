import { Pencil, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { LIMITES_PUBLICACION } from '@/features/publicaciones/limites'
import PostAuthor from '@/features/publicaciones/PostAuthor'
import { comentarioEsquema } from '@/features/publicaciones/publicacionEsquema'
import { editarComentario, eliminarComentario } from '@/features/publicaciones/publicacionesApi'
import type { Comentario } from '@/features/publicaciones/tipos'
import { ApiError } from '@/shared/api/apiError'
import { mensajeDeError } from '@/shared/lib/erroresServidor'
import ConfirmDialog from '@/shared/ui/ConfirmDialog'

type Props = {
  comentario: Comentario
  onEditado: (comentario: Comentario) => void
  onEliminado: (id: string) => void
}

// Un comentario (HU-26). Quien lo escribió lo edita ahí mismo o lo elimina.
export default function CommentItem({ comentario: c, onEditado, onEliminado }: Props) {
  const [editando, setEditando] = useState(false)
  const [borrador, setBorrador] = useState(c.contenido)
  const [error, setError] = useState<string>()
  const [ocupado, setOcupado] = useState(false)
  const [confirmar, setConfirmar] = useState(false)
  const idCampo = `comentario-${c.id}`

  async function guardar(evento: FormEvent) {
    evento.preventDefault()
    const resultado = comentarioEsquema.safeParse({ contenido: borrador })
    if (!resultado.success) {
      setError(resultado.error.issues[0].message)
      return
    }
    setOcupado(true)
    setError(undefined)
    try {
      onEditado(await editarComentario(c.id, resultado.data.contenido))
      setEditando(false)
      toast.success('Comentario actualizado.')
    } catch (e) {
      setError(e instanceof ApiError && e.campos.contenido ? e.campos.contenido[0] : mensajeDeError(e, 'No pudimos guardar el comentario.'))
    } finally {
      setOcupado(false)
    }
  }

  async function eliminar() {
    setOcupado(true)
    try {
      await eliminarComentario(c.id)
      onEliminado(c.id)
      toast.success('Comentario eliminado.')
    } catch (e) {
      toast.error(mensajeDeError(e, 'No pudimos eliminar el comentario. Intenta de nuevo.'))
      setOcupado(false)
    }
  }

  function cancelar() {
    setEditando(false)
    setBorrador(c.contenido)
    setError(undefined)
  }

  return (
    <article aria-label={`Comentario de ${c.autor.nombreCompleto}`} className="space-y-2 py-4">
      <PostAuthor autor={c.autor} creadaEn={c.creadoEn} editadaEn={c.editadoEn} tamano="sm" />

      {editando ? (
        <form noValidate onSubmit={(e) => void guardar(e)} className="space-y-2 pl-11">
          <label htmlFor={idCampo} className="sr-only">
            Editar tu comentario
          </label>
          <Textarea
            id={idCampo}
            rows={3}
            autoFocus
            value={borrador}
            onChange={(e) => setBorrador(e.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={`${idCampo}-ayuda${error ? ` ${idCampo}-error` : ''}`}
          />
          <p id={`${idCampo}-ayuda`} className="text-xs text-muted-foreground">
            {borrador.length} de {LIMITES_PUBLICACION.comentario} caracteres.
          </p>
          {error && (
            <p id={`${idCampo}-error`} role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={ocupado}>
              {ocupado ? 'Guardando...' : 'Guardar'}
            </Button>
            <Button type="button" variant="ghost" size="sm" disabled={ocupado} onClick={cancelar}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <p className="whitespace-pre-line break-words pl-11 text-sm leading-relaxed">{c.contenido}</p>
      )}

      {c.esMio && !editando && (
        <div className="flex gap-1 pl-9">
          <Button variant="ghost" size="xs" disabled={ocupado} onClick={() => setEditando(true)}>
            <Pencil aria-hidden="true" />
            Editar
            <span className="sr-only"> tu comentario</span>
          </Button>
          <Button
            variant="ghost"
            size="xs"
            disabled={ocupado}
            onClick={() => setConfirmar(true)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 aria-hidden="true" />
            Eliminar
            <span className="sr-only"> tu comentario</span>
          </Button>
        </div>
      )}

      <ConfirmDialog
        abierto={confirmar}
        onAbiertoChange={setConfirmar}
        titulo="¿Eliminar tu comentario?"
        descripcion="Dejará de mostrarse en la publicación. Esta acción no se puede deshacer."
        etiquetaConfirmar="Eliminar"
        onConfirmar={() => void eliminar()}
      />
    </article>
  )
}
