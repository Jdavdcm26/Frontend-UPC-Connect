import { Button } from '@/components/ui/button'
import ApplicationStateBadge from '@/features/postulaciones/ApplicationStateBadge'
import type { PostulacionRecibida } from '@/features/postulaciones/tipos'
import { formatearFecha } from '@/shared/lib/fechas'

type Props = {
  postulaciones: PostulacionRecibida[]
  // Postulación cuyo perfil está abierto en el panel (null si ninguna).
  seleccionadaId: string | null
  onSeleccionar: (id: string) => void
}

// Lista de candidatos que se postularon a una vacante (HU-47 / FE-25).
export default function CandidateList({ postulaciones, seleccionadaId, onSeleccionar }: Props) {
  return (
    <ul className="space-y-3">
      {postulaciones.map((postulacion) => {
        const seleccionada = postulacion.id === seleccionadaId
        return (
          <li key={postulacion.id}>
            <article
              aria-current={seleccionada ? 'true' : undefined}
              className={`space-y-2 rounded-lg border p-4 ${seleccionada ? 'border-primary' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="font-semibold">{postulacion.nombre}</h2>
                <ApplicationStateBadge estado={postulacion.estado} />
              </div>
              <p className="text-sm">
                {postulacion.carrera} · Semestre {postulacion.semestre}
              </p>
              <p className="text-sm text-muted-foreground">Se postuló el {formatearFecha(postulacion.creadaEn)}</p>
              <Button
                variant="outline"
                size="sm"
                aria-label={`Ver perfil de ${postulacion.nombre}`}
                onClick={() => onSeleccionar(postulacion.id)}
              >
                Ver perfil
              </Button>
            </article>
          </li>
        )
      })}
    </ul>
  )
}