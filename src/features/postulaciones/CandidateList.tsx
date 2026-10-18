import ApplicationStateBadge from '@/features/postulaciones/ApplicationStateBadge'
import type { PostulacionRecibida } from '@/features/postulaciones/tipos'
import { formatearFecha } from '@/shared/lib/fechas'

// Lista de candidatos que se postularon a una vacante (HU-47 / FE-25).
export default function CandidateList({ postulaciones }: { postulaciones: PostulacionRecibida[] }) {
  return (
    <ul className="space-y-3">
      {postulaciones.map((postulacion) => (
        <li key={postulacion.id}>
          <article className="space-y-2 rounded-lg border p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold">{postulacion.nombre}</h2>
              <ApplicationStateBadge estado={postulacion.estado} />
            </div>
            <p className="text-sm">
              {postulacion.carrera} · Semestre {postulacion.semestre}
            </p>
            <p className="text-sm text-muted-foreground">Se postuló el {formatearFecha(postulacion.creadaEn)}</p>
          </article>
        </li>
      ))}
    </ul>
  )
}