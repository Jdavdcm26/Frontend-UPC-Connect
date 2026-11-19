import { ArrowRight, EyeOff, MessageCircle, Share2, Tag, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import EstadoAperturaBadge from '@/features/publicaciones/EstadoAperturaBadge'
import PostAuthor from '@/features/publicaciones/PostAuthor'
import PostDetails from '@/features/publicaciones/PostDetails'
import PostImages from '@/features/publicaciones/PostImages'
import PostTypeBadge from '@/features/publicaciones/PostTypeBadge'
import ReactionButton from '@/features/publicaciones/ReactionButton'
import type { Publicacion } from '@/features/publicaciones/tipos'
import { rutaPublicacion } from '@/shared/lib/rutas'
import DatoIcono from '@/shared/ui/DatoIcono'
import { claseEnlace } from '@/shared/ui/estilosEnlace'

type Props = {
  publicacion: Publicacion
  // Solo estudiantes y egresados reaccionan; las empresas leen.
  puedeInteractuar: boolean
  // En el feed el texto largo se recorta; en el detalle se muestra completo.
  completa?: boolean
}

const textoComentarios = (n: number) => `${n} ${n === 1 ? 'comentario' : 'comentarios'}`

// Publicación de la comunidad: autor, tipo, categoría, contenido, plantilla, imágenes y reacciones (HU-18).
export default function PostCard({ publicacion: p, puedeInteractuar, completa = false }: Props) {
  async function compartir() {
    const url = `${window.location.origin}${rutaPublicacion(p.id)}`
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: `Publicación de ${p.autor.nombreCompleto}`, url })
        return
      }
      await navigator.clipboard.writeText(url)
      toast.success('Enlace copiado al portapapeles.')
    } catch (error) {
      // Cancelar el diálogo nativo no es un error.
      if (error instanceof DOMException && error.name === 'AbortError') return
      toast.error('No pudimos compartir el enlace. Puedes copiarlo desde la barra del navegador.')
    }
  }

  return (
    <article
      aria-label={`Publicación de ${p.autor.nombreCompleto}`}
      className="tarjeta entrar space-y-4 p-5 transition-shadow duration-300 hover:shadow-lift sm:p-6"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <PostAuthor autor={p.autor} creadaEn={p.creadaEn} editadaEn={p.editadaEn} />
        <div className="flex flex-wrap items-center gap-2">
          {p.esMia && (
            <span className="inline-flex h-6 items-center gap-1 rounded-full bg-primary/10 px-2.5 text-xs font-semibold text-primary ring-1 ring-primary/15">
              <UserRound aria-hidden="true" className="size-3.5" />
              Tu publicación
            </span>
          )}
          <PostTypeBadge tipo={p.tipo} />
          {p.abierta !== null && <EstadoAperturaBadge abierta={p.abierta} />}
        </div>
      </header>

      {p.oculta && (
        <p className="flex items-center gap-2 rounded-xl border border-ambar/25 bg-ambar-soft px-3 py-2 text-sm font-medium text-ambar">
          <EyeOff aria-hidden="true" className="size-4" />
          Oculta por moderación: solo tú la ves.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-primary">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 ring-1 ring-primary/15">
          <Tag aria-hidden="true" className="size-3.5" />
          <span className="sr-only">Categoría: </span>
          {p.categoria.nombre}
        </span>
      </div>

      <p className={completa ? 'text-[15px] leading-7 break-words whitespace-pre-line' : 'line-clamp-6 text-[15px] leading-7 break-words whitespace-pre-line'}>
        {p.contenido}
      </p>

      <PostDetails detalles={p.detalles} />
      <PostImages imagenes={p.imagenes} />

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <ReactionButton
            publicacionId={p.id}
            inicial={{ reacciones: p.reacciones, reaccione: p.reaccione }}
            puedeReaccionar={puedeInteractuar}
          />
          {completa ? (
            <DatoIcono icono={MessageCircle}>{textoComentarios(p.comentarios)}</DatoIcono>
          ) : (
            <Link to={`${rutaPublicacion(p.id)}#comentarios`} className={`${claseEnlace} inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm hover:bg-primary/5`}>
              <MessageCircle aria-hidden="true" className="size-4" />
              {textoComentarios(p.comentarios)}
            </Link>
          )}
          <button
            type="button"
            onClick={() => void compartir()}
            className={`${claseEnlace} inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm hover:bg-primary/5`}
          >
            <Share2 aria-hidden="true" className="size-4" />
            Compartir
          </button>
        </div>
        {!completa && (
          <Link to={rutaPublicacion(p.id)} className={`${claseEnlace} group inline-flex items-center gap-1.5 text-sm font-semibold text-primary`}>
            Ver publicación
            <span className="sr-only"> de {p.autor.nombreCompleto}</span>
            <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" />
          </Link>
        )}
      </footer>
    </article>
  )
}
