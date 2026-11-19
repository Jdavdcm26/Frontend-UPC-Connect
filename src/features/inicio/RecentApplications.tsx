import { ChevronRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import ApplicationStateBadge from '@/features/postulaciones/ApplicationStateBadge'
import type { Postulacion } from '@/features/postulaciones/tipos'
import { formatearFecha } from '@/shared/lib/fechas'
import { RUTAS } from '@/shared/lib/rutas'

// Últimas postulaciones del candidato, con su estado (FE-28). Toda la fila lleva a la vacante:
// el enlace del título se estira sobre la fila (after:absolute) para que el área de clic sea grande.
export default function RecentApplications({ postulaciones }: { postulaciones: Postulacion[] }) {
  return (
    <ul className="space-y-3">
      {postulaciones.map((postulacion) => (
        <li
          key={postulacion.id}
          className="group relative flex items-center gap-4 rounded-xl border border-border/80 bg-background/80 p-4 transition-all duration-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring hover:border-primary/40 hover:bg-muted/40 motion-reduce:transition-none"
        >
          <span className="hidden size-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary sm:flex">
            <FileText aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <Link
              to={`${RUTAS.vacantes}/${postulacion.vacanteId}`}
              className="break-words font-semibold outline-none after:absolute after:inset-0 after:content-[''] transition-colors group-hover:text-primary"
            >
              {postulacion.vacanteTitulo}
            </Link>
            <p className="text-xs text-muted-foreground sm:text-sm">
              {postulacion.empresa} · Enviada el {formatearFecha(postulacion.creadaEn)}
            </p>
          </div>
          <ApplicationStateBadge estado={postulacion.estado} />
          <ChevronRight aria-hidden="true" className="hidden size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary sm:block motion-reduce:transform-none" />
        </li>
      ))}
    </ul>
  )
}
