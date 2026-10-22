import { zodResolver } from '@hookform/resolvers/zod'
import { MessageCircle, Send } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import CommentItem from '@/features/publicaciones/CommentItem'
import { mensajeDeError } from '@/features/publicaciones/errores'
import { LIMITES_PUBLICACION } from '@/features/publicaciones/limites'
import { comentarioEsquema, type ComentarioDatos } from '@/features/publicaciones/publicacionEsquema'
import { comentar, listarComentarios } from '@/features/publicaciones/publicacionesApi'
import type { Comentario } from '@/features/publicaciones/tipos'
import { ApiError } from '@/shared/api/apiError'
import { aplicarErroresServidor } from '@/shared/lib/erroresServidor'
import ErrorState from '@/shared/ui/ErrorState'
import FormField from '@/shared/ui/FormField'

type Props = {
  publicacionId: string
  // Solo estudiantes y egresados comentan; las empresas leen.
  puedeComentar: boolean
  // Suma o resta al contador de comentarios de la publicación.
  onTotalCambia: (cambio: number) => void
}

// Comentarios de una publicación, en orden de conversación, con «Cargar más» y el formulario para comentar (HU-26).
export default function CommentSection({ publicacionId, puedeComentar, onTotalCambia }: Props) {
  const [lista, setLista] = useState<Comentario[]>([])
  const [siguiente, setSiguiente] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [error, setError] = useState<unknown>()
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let vigente = true
    listarComentarios(publicacionId, null)
      .then((pagina) => {
        if (!vigente) return
        setLista(pagina.comentarios)
        setSiguiente(pagina.siguiente)
      })
      .catch((e) => {
        if (vigente) setError(e)
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })
    return () => {
      vigente = false
    }
  }, [publicacionId, intento])

  function reintentar() {
    setCargando(true)
    setError(undefined)
    setIntento((n) => n + 1)
  }

  // Un comentario recién escrito ya está en la lista: si vuelve a llegar en otra página, no se repite.
  const agregarSinRepetir = (actual: Comentario[], nuevos: Comentario[]) => [
    ...actual,
    ...nuevos.filter((n) => !actual.some((a) => a.id === n.id)),
  ]

  async function cargarMas() {
    if (siguiente === null) return
    setCargandoMas(true)
    try {
      const pagina = await listarComentarios(publicacionId, siguiente)
      setLista((actual) => agregarSinRepetir(actual, pagina.comentarios))
      setSiguiente(pagina.siguiente)
    } catch (e) {
      toast.error(mensajeDeError(e, 'No pudimos cargar más comentarios. Intenta de nuevo.'))
    } finally {
      setCargandoMas(false)
    }
  }

  return (
    <section id="comentarios" aria-labelledby="titulo-comentarios" className="scroll-mt-24 rounded-xl border bg-card p-5 shadow-sm sm:p-6">
      <h2 id="titulo-comentarios" className="flex items-center gap-2.5 text-xl font-semibold">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <MessageCircle aria-hidden="true" className="size-4.5" />
        </span>
        Comentarios
      </h2>

      {cargando && (
        <div className="mt-4 space-y-3" role="status" aria-label="Cargando comentarios">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      )}

      {!cargando && error !== undefined && (
        <div className="mt-4">
          <ErrorState mensaje="No pudimos cargar los comentarios. Intenta de nuevo en un momento." onReintentar={reintentar} />
        </div>
      )}

      {!cargando && error === undefined && lista.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          {puedeComentar ? 'Aún no hay comentarios. Escribe el primero.' : 'Aún no hay comentarios.'}
        </p>
      )}

      {lista.length > 0 && (
        <ul className="mt-2 divide-y">
          {lista.map((comentario) => (
            <li key={comentario.id}>
              <CommentItem
                comentario={comentario}
                onEditado={(editado) => setLista((actual) => actual.map((c) => (c.id === editado.id ? editado : c)))}
                onEliminado={(id) => {
                  setLista((actual) => actual.filter((c) => c.id !== id))
                  onTotalCambia(-1)
                }}
              />
            </li>
          ))}
        </ul>
      )}

      {!cargando && siguiente !== null && (
        <div className="mt-2 text-center">
          <Button variant="outline" size="sm" disabled={cargandoMas} onClick={() => void cargarMas()}>
            {cargandoMas ? 'Cargando...' : 'Cargar más comentarios'}
          </Button>
        </div>
      )}

      <div className="mt-4 border-t pt-4">
        {puedeComentar ? (
          <FormularioComentario
            publicacionId={publicacionId}
            onComentado={(nuevo) => {
              setLista((actual) => agregarSinRepetir(actual, [nuevo]))
              onTotalCambia(1)
            }}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Solo estudiantes y egresados pueden comentar las publicaciones.</p>
        )}
      </div>
    </section>
  )
}

function FormularioComentario({
  publicacionId,
  onComentado,
}: {
  publicacionId: string
  onComentado: (comentario: Comentario) => void
}) {
  const [enviando, setEnviando] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ComentarioDatos>({
    resolver: zodResolver(comentarioEsquema),
    defaultValues: { contenido: '' },
  })
  const largo = useWatch({ control, name: 'contenido' }).length

  async function enviar(datos: ComentarioDatos) {
    setEnviando(true)
    try {
      onComentado(await comentar(publicacionId, datos.contenido))
      reset({ contenido: '' })
      toast.success('Comentario publicado.')
    } catch (error) {
      // Un 403 (por ejemplo, sin perfil) se muestra junto al campo con el motivo del servidor.
      if (!aplicarErroresServidor(error, setError)) {
        setError('contenido', {
          type: 'server',
          message: error instanceof ApiError ? error.message : 'No pudimos publicar el comentario. Intenta de nuevo.',
        })
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(enviar)} className="space-y-3">
      <FormField
        id="nuevo-comentario"
        etiqueta="Escribe un comentario"
        ayuda={`${largo} de ${LIMITES_PUBLICACION.comentario} caracteres.`}
        error={errors.contenido?.message}
      >
        {(campo) => <Textarea rows={3} {...campo} {...register('contenido')} />}
      </FormField>
      <div className="flex justify-end">
        <Button type="submit" disabled={enviando}>
          <Send aria-hidden="true" />
          {enviando ? 'Comentando...' : 'Comentar'}
        </Button>
      </div>
    </form>
  )
}
