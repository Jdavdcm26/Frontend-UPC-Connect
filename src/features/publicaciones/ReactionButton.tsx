import { ThumbsUp } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'
import { alternarReaccion } from '@/features/publicaciones/conversiones'
import { mensajeDeError } from '@/features/publicaciones/errores'
import { reaccionar } from '@/features/publicaciones/publicacionesApi'
import type { EstadoReaccion } from '@/features/publicaciones/tipos'

type Props = {
  publicacionId: string
  inicial: EstadoReaccion
  // Las empresas solo ven el total: no reaccionan.
  puedeReaccionar: boolean
}

const textoTotal = (n: number) => `${n} ${n === 1 ? 'reacción' : 'reacciones'}`

// «Me gusta» de una publicación (HU-25). El cambio se ve de inmediato y se deshace si el servidor falla.
export default function ReactionButton({ publicacionId, inicial, puedeReaccionar }: Props) {
  const [estado, setEstado] = useState(inicial)
  const [enviando, setEnviando] = useState(false)

  if (!puedeReaccionar) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
        <ThumbsUp aria-hidden="true" className="size-4" />
        {textoTotal(estado.reacciones)}
      </span>
    )
  }

  async function alternar() {
    const anterior = estado
    setEstado(alternarReaccion(anterior))
    setEnviando(true)
    try {
      // El servidor devuelve el total real (otras personas pudieron reaccionar entretanto).
      setEstado(await reaccionar(publicacionId, !anterior.reaccione))
    } catch (error) {
      setEstado(anterior)
      toast.error(mensajeDeError(error, 'No pudimos guardar tu reacción. Intenta de nuevo.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-pressed={estado.reaccione}
      disabled={enviando}
      onClick={() => void alternar()}
      className={cn(estado.reaccione && 'bg-primary-soft font-semibold text-primary hover:bg-primary-soft hover:text-primary')}
    >
      <ThumbsUp aria-hidden="true" className={cn(estado.reaccione && 'fill-current')} />
      Me gusta
      <span className="text-muted-foreground" aria-hidden="true">·</span>
      <span>
        {estado.reacciones}
        <span className="sr-only"> {estado.reacciones === 1 ? 'reacción' : 'reacciones'}</span>
      </span>
    </Button>
  )
}
