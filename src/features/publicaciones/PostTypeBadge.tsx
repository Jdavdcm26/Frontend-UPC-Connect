import { HandHelping, MessageSquareText, UsersRound, type LucideIcon } from 'lucide-react'
import { cn } from 'cn'
import { ETIQUETA_TIPO_PUBLICACION, type TipoPublicacion } from '@/features/publicaciones/tipos'

// Cada tipo tiene su color y su icono para reconocerlo de un vistazo; el texto siempre dice el tipo.
const ESTILO: Record<TipoPublicacion, { clases: string; icono: LucideIcon }> = {
  GENERAL: { clases: 'bg-estado-recibida-soft text-estado-recibida', icono: MessageSquareText },
  SERVICIO: { clases: 'bg-primary-soft text-primary', icono: HandHelping },
  BUSQUEDA_EQUIPO: { clases: 'bg-estado-entrevista-soft text-estado-entrevista', icono: UsersRound },
}

// Etiqueta con el tipo de publicación: general, servicio o búsqueda de equipo.
export default function PostTypeBadge({ tipo }: { tipo: TipoPublicacion }) {
  const { clases, icono: Icono } = ESTILO[tipo]
  return (
    <span className={cn('inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-semibold', clases)}>
      <Icono aria-hidden="true" className="size-3.5" />
      {ETIQUETA_TIPO_PUBLICACION[tipo]}
    </span>
  )
}
