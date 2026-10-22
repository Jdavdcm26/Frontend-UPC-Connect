import { Ban, UserCheck } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { bloquear } from '@/features/red/redApi'
import { mensajeDeError } from '@/shared/lib/erroresServidor'
import ConfirmDialog from '@/shared/ui/ConfirmDialog'

type Props = {
  usuarioId: string
  nombre: string
  bloqueada: boolean
  // Después de bloquear o desbloquear, el perfil se vuelve a pedir (cambian los contadores).
  onCambio: () => void
}

// Bloquear o desbloquear una cuenta (HU-31). Bloquear pide confirmación y explica qué pasa.
export default function BlockButton({ usuarioId, nombre, bloqueada, onCambio }: Props) {
  const [enviando, setEnviando] = useState(false)
  const [confirmar, setConfirmar] = useState(false)

  async function cambiar(bloquearCuenta: boolean) {
    setEnviando(true)
    try {
      await bloquear(usuarioId, bloquearCuenta)
      toast.success(bloquearCuenta ? `Bloqueaste a ${nombre}.` : `Desbloqueaste a ${nombre}.`)
      onCambio()
    } catch (error) {
      toast.error(mensajeDeError(error, 'No pudimos guardar el cambio. Intenta de nuevo.'))
    } finally {
      setEnviando(false)
    }
  }

  if (bloqueada) {
    return (
      <Button variant="outline" disabled={enviando} onClick={() => void cambiar(false)}>
        <UserCheck aria-hidden="true" />
        Desbloquear
      </Button>
    )
  }

  return (
    <>
      <Button variant="outline" disabled={enviando} onClick={() => setConfirmar(true)} className="text-destructive hover:text-destructive">
        <Ban aria-hidden="true" />
        Bloquear
      </Button>
      <ConfirmDialog
        abierto={confirmar}
        onAbiertoChange={setConfirmar}
        titulo={`¿Bloquear a ${nombre}?`}
        descripcion="Dejarán de ver las publicaciones y los comentarios del otro, y si se seguían, el seguimiento se quita en las dos direcciones. No le avisaremos. Puedes desbloquearla cuando quieras desde «Cuentas bloqueadas»."
        etiquetaConfirmar="Bloquear"
        onConfirmar={() => void cambiar(true)}
      />
    </>
  )
}
