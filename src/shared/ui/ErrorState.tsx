import { Button } from '@/components/ui/button'

type Props = {
  mensaje: string
  onReintentar?: () => void
}

// Estado de error: explica qué pasó y ofrece reintentar.
export default function ErrorState({ mensaje, onReintentar }: Props) {
  return (
    <div role="alert" className="space-y-3 rounded-lg border border-destructive/40 p-8 text-center">
      <p className="text-destructive">{mensaje}</p>
      {onReintentar && (
        <Button variant="outline" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  )
}