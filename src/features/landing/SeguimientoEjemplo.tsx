import { Building2, Check, Clock, Sparkles } from 'lucide-react'
import ApplicationStateBadge from '@/features/postulaciones/ApplicationStateBadge'
import type { EstadoPostulacion } from '@/features/postulaciones/tipos'

type PasoInfo = {
  estado: EstadoPostulacion
  completado: boolean
  activo: boolean
  fecha: string
}

const PASOS: PasoInfo[] = [
  { estado: 'RECIBIDA', completado: true, activo: false, fecha: '12 nov' },
  { estado: 'EN_REVISION', completado: true, activo: false, fecha: '14 nov' },
  { estado: 'ENTREVISTA', completado: false, activo: true, fecha: 'Hoy, 2:30 PM' },
  { estado: 'SELECCIONADO', completado: false, activo: false, fecha: 'Pendiente' },
]

// Ilustración de la portada: tarjeta con diseño refinado que muestra el seguimiento en tiempo real.
// Es solo decorativa, por eso se oculta a los lectores de pantalla.
export default function SeguimientoEjemplo() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md select-none">
      {/* Resplandor ambiental suave en oklab */}
      <div className="absolute -inset-2 rounded-3xl bg-linear-to-tr from-primary/20 via-emerald-500/10 to-teal-500/20 blur-2xl" />

      <div className="relative rounded-2xl border border-border/80 bg-card/95 p-6 shadow-xl backdrop-blur-md ring-1 ring-black/[0.03] dark:ring-white/[0.04]">
        {/* Cabecera de la vacante de ejemplo */}
        <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-linear-to-br from-primary/15 to-emerald-500/10 text-primary border border-primary/20 shadow-2xs">
              <Building2 className="size-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-foreground">Practicante de Software</p>
              <p className="text-xs text-muted-foreground">Alianza Tecnológica · Valledupar</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse motion-reduce:animate-none" />
            En curso
          </span>
        </div>

        {/* Línea de tiempo de pasos con diseño interactivo */}
        <ol className="mt-5 space-y-4">
          {PASOS.map(({ estado, completado, activo, fecha }) => (
            <li
              key={estado}
              className="relative flex items-center justify-between gap-3 pl-7 before:absolute before:top-3.5 before:left-[11px] before:h-[calc(100%+1rem)] before:w-[2px] before:bg-border/70 last:before:hidden"
            >
              {/* Nodo indicador */}
              <span
                className={`absolute left-0 flex size-6 items-center justify-center rounded-full border text-[11px] font-bold transition-all ${
                  activo
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs shadow-primary/30 ring-4 ring-primary/15'
                    : completado
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-border bg-muted/60 text-muted-foreground'
                }`}
              >
                {completado ? (
                  <Check className="size-3.5 stroke-[2.5]" />
                ) : activo ? (
                  <span className="size-2 rounded-full bg-white" />
                ) : (
                  <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                )}
              </span>

              <div className="flex flex-1 items-center justify-between gap-2">
                <ApplicationStateBadge estado={estado} />
                <span className="text-[11px] font-medium text-muted-foreground/90">{fecha}</span>
              </div>
            </li>
          ))}
        </ol>

        {/* Tarjeta flotante inferior con métrica sutil */}
        <div className="mt-6 flex items-center justify-between rounded-xl bg-muted/50 p-3 text-xs border border-border/50">
          <span className="flex items-center gap-2 font-medium text-foreground">
            <Clock className="size-3.5 text-primary" />
            Última actualización
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-primary">
            <Sparkles className="size-3" />
            Hace 20 min
          </span>
        </div>
      </div>
    </div>
  )
}
