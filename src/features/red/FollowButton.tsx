import { UserMinus, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { seguir } from '@/features/red/redApi'
import { mensajeDeError } from '@/shared/lib/erroresServidor'

type Props = {
  usuarioId: string
  nombre: string
  siguiendo: boolean
  onCambio: (resultado: { siguiendo: boolean; seguidores: number }) => void
}

// Seguir o dejar de seguir a otra persona (HU-28). El texto del botón dice qué hará al pulsarlo.
export default function FollowButton({ usuarioId, nombre, siguiendo, onCambio }: Props) {
  const [enviando, setEnviando] = useState(false)

  async function alternar() {
    setEnviando(true)
    try {
      const resultado = await seguir(usuarioId, !siguiendo)
      onCambio(resultado)
      toast.success(resultado.siguiendo ? `Ahora sigues a ${nombre}.` : `Dejaste de seguir a ${nombre}.`)
    } catch (error) {
      toast.error(mensajeDeError(error, 'No pudimos guardar el cambio. Intenta de nuevo.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Button variant={siguiendo ? 'outline' : 'default'} disabled={enviando} onClick={() => void alternar()}>
      {siguiendo ? <UserMinus aria-hidden="true" /> : <UserPlus aria-hidden="true" />}
      {siguiendo ? 'Dejar de seguir' : 'Seguir'}
    </Button>
  )
}
