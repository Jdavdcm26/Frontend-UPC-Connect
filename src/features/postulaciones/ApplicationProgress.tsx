import { Check } from 'lucide-react'
import { cn } from 'cn'
import { ETIQUETA_ESTADO_POSTULACION, type EstadoPostulacion } from '@/features/postulaciones/tipos'

// Las cuatro etapas del proceso, en orden. «No seleccionado» no es una etapa: es el final del proceso.
const ETAPAS = ['RECIBIDA', 'EN_REVISION', 'ENTREVISTA', 'SELECCIONADO'] as const

// Barra de etapas de una postulación: marca en qué etapa está según su estado actual.
// Con «No seleccionado» no se dibuja (no hay una etapa que mostrar): el estado ya lo dice la etiqueta.
export default function ApplicationProgress({ estado }: { estado: EstadoPostulacion }) {
  const actual = ETAPAS.findIndex((etapa) => etapa === estado)
  if (actual === -1) return null

  return (
    <ol aria-label="Etapa de la postulación" className="grid grid-cols-4">
      {ETAPAS.map((etapa, indice) => {
        const alcanzada = indice <= actual
        const esActual = indice === actual
        return (
          <li
            key={etapa}
            aria-current={esActual ? 'step' : undefined}
            className={cn(
              'relative flex flex-col items-center gap-1.5 text-center',
              // Línea que une esta etapa con la anterior.
              indice > 0 &&
                "before:absolute before:top-3 before:right-1/2 before:h-0.5 before:w-full before:-translate-y-1/2 before:content-['']",
              indice > 0 && (alcanzada ? 'before:bg-primary' : 'before:bg-border'),
            )}
          >
            <span
              className={cn(
                'relative z-10 flex size-6 items-center justify-center rounded-full text-xs font-semibold',
                alcanzada
                  ? 'bg-primary text-primary-foreground'
                  : 'border-2 border-input bg-background text-muted-foreground',
                esActual && 'ring-4 ring-primary-soft',
              )}
            >
              {alcanzada ? <Check aria-hidden="true" className="size-3.5" /> : indice + 1}
            </span>
            <span
              className={cn(
                // En pantallas angostas solo se ven los círculos (la etiqueta de estado ya dice la etapa).
                'sr-only px-0.5 text-xs sm:not-sr-only sm:break-words',
                esActual ? 'font-semibold text-primary' : alcanzada ? 'font-medium' : 'text-muted-foreground',
              )}
            >
              {ETIQUETA_ESTADO_POSTULACION[etapa]}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
