import { etiquetaNivel, etiquetaTipo } from '@/features/perfil/formato'
import type { HabilidadPerfil, NivelHabilidad } from '@/features/perfil/tipos'
import { cn } from 'cn'

// Traducción visual del nivel real del servidor. No inventa un porcentaje de dominio:
// solo representa Básico / Intermedio / Avanzado en una escala equidistante.
const PORCENTAJE: Record<NivelHabilidad, number> = {
  BASICO: 35,
  INTERMEDIO: 68,
  AVANZADO: 100,
}

export default function NivelHabilidadBar({ habilidad, className }: { habilidad: HabilidadPerfil; className?: string }) {
  if (!habilidad.nivel) {
    return (
      <span className={cn('inline-flex h-fit w-fit items-center rounded-full border border-border/70 bg-background/70 px-3 py-1.5 text-xs font-medium', className)}>
        {habilidad.nombre}
      </span>
    )
  }

  const porcentaje = PORCENTAJE[habilidad.nivel]

  return (
    <div className={cn('space-y-2 rounded-xl border border-border/60 bg-background/60 p-3', className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="break-words text-sm font-semibold text-foreground">{habilidad.nombre}</p>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{etiquetaTipo(habilidad.tipo)}</p>
        </div>
        <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
          {etiquetaNivel(habilidad.nivel)}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`${habilidad.nombre}: ${etiquetaNivel(habilidad.nivel)}`}
        aria-valuenow={porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1.5 w-full overflow-hidden rounded-full bg-primary/10"
      >
        <div
          className="h-full rounded-full bg-linear-to-r from-primary to-emerald-500"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  )
}
