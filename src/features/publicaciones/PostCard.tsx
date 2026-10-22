import { ArrowRight, EyeOff, MessageCircle, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
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
  return (
    <article
      aria-label={`Publicación de ${p.autor.nombreCompleto}`}
      className="space-y-4 rounded-xl border bg-card p-5 shadow-sm sm:p-6"
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <PostAuthor autor={p.autor} creadaEn={p.creadaEn} editadaEn={p.editadaEn} />
        <div className="flex flex-wrap gap-2">
          <PostTypeBadge tipo={p.tipo} />
          {p.abierta !== null && <EstadoAperturaBadge abierta={p.abierta} />}
        </div>
      </header>

      {p.oculta && (
        <p className="flex items-center gap-2 text-sm font-medium text-ambar">
          <EyeOff aria-hidden="true" className="size-4" />
          Oculta por moderación: solo tú la ves.
        </p>
      )}

      <DatoIcono icono={Tag}>
        <span className="sr-only">Categoría: </span>
        {p.categoria.nombre}
      </DatoIcono>

      <p className={completa ? 'whitespace-pre-line break-words leading-relaxed' : 'line-clamp-6 whitespace-pre-line break-words leading-relaxed'}>
        {p.contenido}
      </p>

      <PostDetails detalles={p.detalles} />
      <PostImages imagenes={p.imagenes} />

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
        <div className="flex flex-wrap items-center gap-3">
          <ReactionButton
            publicacionId={p.id}
            inicial={{ reacciones: p.reacciones, reaccione: p.reaccione }}
            puedeReaccionar={puedeInteractuar}
          />
          {completa ? (
            <DatoIcono icono={MessageCircle}>{textoComentarios(p.comentarios)}</DatoIcono>
          ) : (
            <Link to={`${rutaPublicacion(p.id)}#comentarios`} className={`${claseEnlace} inline-flex items-center gap-1.5 text-sm`}>
              <MessageCircle aria-hidden="true" className="size-4" />
              {textoComentarios(p.comentarios)}
            </Link>
          )}
        </div>
        {!completa && (
          <Link to={rutaPublicacion(p.id)} className={`${claseEnlace} inline-flex items-center gap-1.5 text-sm`}>
            Ver publicación
            <span className="sr-only"> de {p.autor.nombreCompleto}</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        )}
      </footer>
    </article>
  )
}
