import { Link } from 'react-router-dom'
import ApplicationStateBadge from '@/features/postulaciones/ApplicationStateBadge'
import type { Postulacion } from '@/features/postulaciones/tipos'
import { formatearFecha } from '@/shared/lib/fechas'
import { RUTAS } from '@/shared/lib/rutas'

// Últimas postulaciones del candidato, con su estado (FE-28). El título lleva a la vacante.
export default function RecentApplications({ postulaciones }: { postulaciones: Postulacion[] }) {
  return (
    <ul className="divide-y">
      {postulaciones.map((postulacion) => (
        <li
          key={postulacion.id}
          className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0 last:pb-0"
        >
          <div className="min-w-0">
            <Link to={`${RUTAS.vacantes}/${postulacion.vacanteId}`} className="break-words font-medium hover:underline">
              {postulacion.vacanteTitulo}
            </Link>
            <p className="text-sm text-muted-foreground">
              {postulacion.empresa} · Enviada el {formatearFecha(postulacion.creadaEn)}
            </p>
          </div>
          <ApplicationStateBadge estado={postulacion.estado} />
        </li>
      ))}
    </ul>
  )
}
