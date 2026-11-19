import { CalendarDays, ChevronRight, GraduationCap, UserRound } from 'lucide-react'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'
import { resumenAcademico } from '@/features/perfil/formato'
import ApplicationStateBadge from '@/features/postulaciones/ApplicationStateBadge'
import { idBotonVerPerfil } from '@/features/postulaciones/foco'
import type { PostulacionRecibida } from '@/features/postulaciones/tipos'
import { formatearFecha } from '@/shared/lib/fechas'
import DatoIcono from '@/shared/ui/DatoIcono'

type Props = {
  postulaciones: PostulacionRecibida[]
  // Postulación cuyo perfil está abierto en el panel (null si ninguna).
  seleccionadaId: string | null
  onSeleccionar: (id: string) => void
}

// Lista de candidatos que se postularon a una vacante (HU-47 / FE-25).
export default function CandidateList({ postulaciones, seleccionadaId, onSeleccionar }: Props) {
  return (
    <ul className="space-y-4">
      {postulaciones.map((postulacion) => {
        const seleccionada = postulacion.id === seleccionadaId
        return (
          <li key={postulacion.id}>
            <article
              aria-current={seleccionada ? 'true' : undefined}
              className={cn(
                'group flex flex-wrap items-center gap-4 rounded-2xl border border-border/80 bg-card/95 p-5 shadow-xs backdrop-blur-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md',
                seleccionada && 'border-primary/50 bg-primary/[0.06] ring-1 ring-primary/30',
              )}
            >
              <span className="hidden size-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-linear-to-br from-primary/15 to-emerald-500/10 text-primary shadow-2xs sm:flex">
                <UserRound aria-hidden="true" className="size-6" />
              </span>
              <div className="min-w-0 flex-1 basis-60 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="break-words text-lg font-bold tracking-tight">{postulacion.nombre}</h2>
                  <ApplicationStateBadge estado={postulacion.estado} />
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
                  <DatoIcono icono={GraduationCap}>{resumenAcademico(postulacion)}</DatoIcono>
                  <DatoIcono icono={CalendarDays}>Se postuló el {formatearFecha(postulacion.creadaEn)}</DatoIcono>
                </div>
              </div>
              <Button
                variant={seleccionada ? 'default' : 'outline'}
                id={idBotonVerPerfil(postulacion.id)}
                aria-label={`Ver perfil de ${postulacion.nombre}`}
                onClick={() => onSeleccionar(postulacion.id)}
              >
                Ver perfil
                <ChevronRight aria-hidden="true" />
              </Button>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
