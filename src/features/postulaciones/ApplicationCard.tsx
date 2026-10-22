import { Link } from 'react-router-dom'
import ApplicationStateBadge from '@/features/postulaciones/ApplicationStateBadge'
import type { Postulacion } from '@/features/postulaciones/tipos'
import { formatearFecha } from '@/shared/lib/fechas'
import { RUTAS } from '@/shared/lib/rutas'

// Tarjeta de una postulación en «Mis postulaciones» (HU-46 / FE-24). El título lleva a la vacante.
export default function ApplicationCard({ postulacion }: { postulacion: Postulacion }) {
  return (
    <article className="space-y-2 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold">
          <Link to={`${RUTAS.vacantes}/${postulacion.vacanteId}`} className="hover:underline">
            {postulacion.vacanteTitulo}
          </Link>
        </h2>
        <ApplicationStateBadge estado={postulacion.estado} />
      </div>
      <p className="text-sm">{postulacion.empresa}</p>
      <p className="text-sm text-muted-foreground">Enviada el {formatearFecha(postulacion.creadaEn)}</p>
      {postulacion.mensaje && (
        <p className="whitespace-pre-line break-words text-sm text-muted-foreground">
          Tu mensaje: {postulacion.mensaje}
        </p>
      )}
    </article>
  )
}