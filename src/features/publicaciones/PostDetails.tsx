import { CalendarClock, FolderKanban, Monitor, Shapes, UserSearch, UsersRound, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Publicacion } from '@/features/publicaciones/tipos'
import { ETIQUETA_MODALIDAD } from '@/features/vacantes/tipos'

// Fila de la plantilla: etiqueta con icono y valor.
function Fila({ icono: Icono, etiqueta, children }: { icono: LucideIcon; etiqueta: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-2">
      <dt className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
        <Icono aria-hidden="true" className="size-4" />
        {etiqueta}:
      </dt>
      <dd className="min-w-0 whitespace-pre-line break-words text-sm font-medium">{children}</dd>
    </div>
  )
}

// Datos de la plantilla de un servicio o de una búsqueda de equipo (HU-19, HU-20).
export default function PostDetails({ detalles }: { detalles: Publicacion['detalles'] }) {
  if (!detalles) return null
  return (
    <dl className="space-y-2 rounded-lg border bg-tint p-3 sm:p-4">
      {detalles.tipo === 'SERVICIO' ? (
        <>
          <Fila icono={Shapes} etiqueta="Área">{detalles.area}</Fila>
          <Fila icono={Monitor} etiqueta="Modalidad">{ETIQUETA_MODALIDAD[detalles.modalidad]}</Fila>
          <Fila icono={CalendarClock} etiqueta="Disponibilidad">{detalles.disponibilidad}</Fila>
        </>
      ) : (
        <>
          <Fila icono={FolderKanban} etiqueta="Proyecto">{detalles.proyecto}</Fila>
          <Fila icono={UserSearch} etiqueta="Perfiles que busca">{detalles.perfilesRequeridos}</Fila>
          <Fila icono={UsersRound} etiqueta="Cupos">{detalles.cupos}</Fila>
        </>
      )}
    </dl>
  )
}
