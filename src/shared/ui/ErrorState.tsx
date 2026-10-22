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
      className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-red-50 p-8 text-center"
    >
      <TriangleAlert aria-hidden="true" className="size-6 text-destructive" />
      <p className="text-destructive">{mensaje}</p>
      {onReintentar && (
        <Button variant="outline" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
