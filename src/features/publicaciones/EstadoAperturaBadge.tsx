import { CircleCheck, Lock } from 'lucide-react'
import { cn } from 'cn'

// Si un servicio o una búsqueda de equipo sigue disponible. El texto lo dice, no solo el color.
export default function EstadoAperturaBadge({ abierta }: { abierta: boolean }) {
  const Icono = abierta ? CircleCheck : Lock
  return (
    <span
      className={cn(
        'inline-flex h-6 w-fit shrink-0 items-center gap-1 rounded-full px-2.5 text-xs font-semibold',
        abierta ? 'bg-estado-seleccionado-soft text-estado-seleccionado' : 'bg-ambar-soft text-ambar',
      )}
    >
      <Icono aria-hidden="true" className="size-3.5" />
      {abierta ? 'Abierta' : 'Cerrada'}
    </span>
  )
}
