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
          className="relative flex items-center gap-4 rounded-lg border bg-background p-4 transition-colors focus-within:ring-2 focus-within:ring-ring hover:bg-muted/60"
        >
          <span className="hidden size-10 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary sm:flex">
            <FileText aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <Link
              to={`${RUTAS.vacantes}/${postulacion.vacanteId}`}
              className="break-words font-semibold outline-none after:absolute after:inset-0 after:content-[''] hover:underline"
            >
              {postulacion.vacanteTitulo}
            </Link>
            <p className="text-sm text-muted-foreground">
              {postulacion.empresa} · Enviada el {formatearFecha(postulacion.creadaEn)}
            </p>
          </div>
          <ApplicationStateBadge estado={postulacion.estado} />
          <ChevronRight aria-hidden="true" className="hidden size-5 shrink-0 text-muted-foreground sm:block" />
        </li>
      ))}
    </ul>
  )
}
