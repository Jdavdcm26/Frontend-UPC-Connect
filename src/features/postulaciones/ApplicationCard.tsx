import { Building2, CalendarDays, MessageSquareText } from 'lucide-react'
import { Link } from 'react-router-dom'
import ApplicationProgress from '@/features/postulaciones/ApplicationProgress'
import ApplicationStateBadge from '@/features/postulaciones/ApplicationStateBadge'
import type { Postulacion } from '@/features/postulaciones/tipos'
import { formatearFecha } from '@/shared/lib/fechas'
import { RUTAS } from '@/shared/lib/rutas'
import DatoIcono from '@/shared/ui/DatoIcono'

// Tarjeta de una postulación en «Mis postulaciones» (HU-46 / FE-24). El enlace del título se estira
// sobre la tarjeta (after:absolute) y lleva a la vacante.
export default function ApplicationCard({ postulacion }: { postulacion: Postulacion }) {
  return (
    <article className="relative space-y-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring motion-reduce:transition-none sm:p-6">
      {/* En pantallas angostas la etiqueta de estado va arriba para que el título tenga todo el ancho. */}
      <div className="flex flex-col-reverse items-start gap-2 sm:flex-row sm:justify-between sm:gap-3">
        <div className="min-w-0 space-y-1.5">
          <h2 className="text-lg font-semibold">
            <Link
              to={`${RUTAS.vacantes}/${postulacion.vacanteId}`}
              className="break-words outline-none after:absolute after:inset-0 after:content-[''] hover:underline"
            >
              {postulacion.vacanteTitulo}
            </Link>
          </h2>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <DatoIcono icono={Building2}>{postulacion.empresa}</DatoIcono>
            <DatoIcono icono={CalendarDays}>Enviada el {formatearFecha(postulacion.creadaEn)}</DatoIcono>
          </div>
        </div>
        <ApplicationStateBadge estado={postulacion.estado} />
      </div>

      <ApplicationProgress estado={postulacion.estado} />

      {postulacion.mensaje && (
        <div className="flex items-start gap-3 rounded-lg bg-muted/60 p-3 text-sm">
          <MessageSquareText aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="whitespace-pre-line break-words text-muted-foreground">
            <span className="font-medium text-foreground">Tu mensaje: </span>
            {postulacion.mensaje}
          </p>
        </div>
      )}
    </article>
  )
}
