import { ClipboardList } from 'lucide-react'
import ApplicationStateBadge from '@/features/postulaciones/ApplicationStateBadge'
import type { EstadoPostulacion } from '@/features/postulaciones/tipos'

// Los estados que recorre una postulación (los mismos que ve la persona dentro de la app).
const PASOS: EstadoPostulacion[] = ['RECIBIDA', 'EN_REVISION', 'ENTREVISTA', 'SELECCIONADO']

// Ilustración de la portada: una tarjeta que muestra cómo se ve el seguimiento de una postulación.
// Es solo decorativa (no lleva datos de personas ni empresas), por eso se oculta a los lectores de pantalla.
export default function SeguimientoEjemplo() {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-sm">
      <div className="absolute -inset-4 rounded-3xl bg-primary-soft/80 blur-2xl" />
      <div className="relative rounded-2xl border bg-card p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <ClipboardList className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Seguimiento de tu postulación</p>
            <p className="text-xs text-muted-foreground">Ejemplo ilustrativo</p>
          </div>
        </div>
        <ol className="mt-6">
          {PASOS.map((estado) => (
            <li
              key={estado}
              className="relative flex items-center gap-3 pb-5 pl-0 before:absolute before:top-5 before:left-[5px] before:h-full before:w-px before:bg-border last:pb-0 last:before:hidden"
            >
              <span className="relative size-[11px] shrink-0 rounded-full bg-primary ring-4 ring-card" />
              <ApplicationStateBadge estado={estado} />
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
