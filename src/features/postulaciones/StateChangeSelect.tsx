import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cambiarEstadoPostulacion } from '@/features/postulaciones/postulacionesEmpresaApi'
import {
  ESTADOS_POSTULACION,
  ETIQUETA_ESTADO_POSTULACION,
  type DetallePostulacionRecibida,
  type EstadoPostulacion,
} from '@/features/postulaciones/tipos'
import { ApiError } from '@/shared/api/apiError'
import ConfirmDialog from '@/shared/ui/ConfirmDialog'
import SelectField from '@/shared/ui/SelectField'

type Props = {
  postulacionId: string
  estadoActual: EstadoPostulacion
  // Recibe el detalle que devuelve el servidor, para que el panel y la lista muestren el estado nuevo.
  onCambiado: (detalle: DetallePostulacionRecibida) => void
}

const OPCIONES = ESTADOS_POSTULACION.map((estado) => ({
  valor: estado,
  etiqueta: ETIQUETA_ESTADO_POSTULACION[estado],
}))

// Elegir un nuevo estado para la postulación y confirmarlo (HU-47 / FE-25).
// La empresa solo elige entre los cinco estados de gestión; «Retirada» no se ofrece.
// El padre le pone key={estadoActual}, así la elección se reinicia cuando el estado cambia.
export default function StateChangeSelect({ postulacionId, estadoActual, onCambiado }: Props) {
  const [elegido, setElegido] = useState<EstadoPostulacion>(estadoActual)
  const [confirmando, setConfirmando] = useState(false)
  const [cambiando, setCambiando] = useState(false)

  async function cambiar(estado: EstadoPostulacion) {
    setCambiando(true)
    try {
      const detalle = await cambiarEstadoPostulacion(postulacionId, estado)
      toast.success(`Estado cambiado a «${ETIQUETA_ESTADO_POSTULACION[detalle.estado]}».`)
      // Al subir el estado nuevo, el padre vuelve a montar este componente (key={estadoActual}).
      onCambiado(detalle)
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'No pudimos cambiar el estado. Intenta de nuevo.')
      setCambiando(false)
    }
  }

  const etiquetaElegida = ETIQUETA_ESTADO_POSTULACION[elegido]

  return (
    <div className="space-y-2">
      <SelectField
        id="estado-postulacion"
        etiqueta="Nuevo estado"
        placeholder="Elige un estado"
        opciones={OPCIONES}
        valor={elegido}
        onChange={(valor) => setElegido(valor as EstadoPostulacion)}
      />
      <Button
        size="sm"
        disabled={elegido === estadoActual || cambiando}
        onClick={() => setConfirmando(true)}
      >
        {cambiando ? 'Cambiando…' : 'Cambiar estado'}
      </Button>
      <ConfirmDialog
        abierto={confirmando}
        onAbiertoChange={setConfirmando}
        titulo={`¿Cambiar el estado a «${etiquetaElegida}»?`}
        descripcion="Se le avisará al candidato por correo con el nuevo estado."
        etiquetaConfirmar="Cambiar estado"
        onConfirmar={() => void cambiar(elegido)}
      />
    </div>
  )
}