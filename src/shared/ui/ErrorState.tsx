import { TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = {
  mensaje: string
  onReintentar?: () => void
}

// Estado de error: explica qué pasó y ofrece reintentar. Texto rojo oscuro sobre fondo rosado
// suave (contraste de 4,5:1 o más).
export default function ErrorState({ mensaje, onReintentar }: Props) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 rounded-2xl border border-destructive/25 bg-destructive/5 p-8 text-center backdrop-blur-xs sm:p-10"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <TriangleAlert aria-hidden="true" className="size-6 text-destructive" />
      </span>
      <p className="max-w-xs text-sm font-medium leading-relaxed text-destructive">{mensaje}</p>
      {onReintentar && (
        <Button variant="outline" onClick={onReintentar} className="shadow-xs">
          Reintentar
        </Button>
      )}
    </div>
  )
}
