import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  cambiarEstadoPostulacion,
  claveDetalleRecibida,
  claveRecibidas,
  type PaginaRecibidas,
} from '@/features/postulaciones/postulacionesEmpresaApi'
import {
  ESTADOS_POSTULACION,
  ETIQUETA_ESTADO_POSTULACION,
  type EstadoPostulacion,
} from '@/features/postulaciones/tipos'
import { ApiError } from '@/shared/api/apiError'
import ConfirmDialog from '@/shared/ui/ConfirmDialog'
import SelectField from '@/shared/ui/SelectField'

type Props = {
  postulacionId: string
  vacanteId: string
  estadoActual: EstadoPostulacion
}

const OPCIONES = ESTADOS_POSTULACION.map((estado) => ({
  valor: estado,
  etiqueta: ETIQUETA_ESTADO_POSTULACION[estado],
}))

// Elegir un nuevo estado para la postulación y confirmarlo (HU-47 / FE-25).
// La empresa solo elige entre los cinco estados de gestión; «Retirada» no se ofrece.
// El padre le pone key={estadoActual}, así la elección se reinicia cuando el estado cambia.
export default function StateChangeSelect({ postulacionId, vacanteId, estadoActual }: Props) {
  const queryClient = useQueryClient()
  const [elegido, setElegido] = useState<EstadoPostulacion>(estadoActual)
  const [confirmando, setConfirmando] = useState(false)

  const cambio = useMutation({
    mutationFn: (estado: EstadoPostulacion) => cambiarEstadoPostulacion(postulacionId, estado),
    onSuccess: (detalle) => {
      // El panel y la lista muestran el estado nuevo de inmediato; después la lista se vuelve a pedir al servidor.
      queryClient.setQueryData(claveDetalleRecibida(postulacionId), detalle)
      queryClient.setQueryData<InfiniteData<PaginaRecibidas, string | null>>(claveRecibidas(vacanteId), (datos) =>
        datos && {
          ...datos,
          pages: datos.pages.map((pagina) => ({
            ...pagina,
            postulaciones: pagina.postulaciones.map((p) =>
              p.id === detalle.id ? { ...p, estado: detalle.estado } : p,
            ),
          })),
        },
      )
      void queryClient.invalidateQueries({ queryKey: claveRecibidas(vacanteId) })
      toast.success(`Estado cambiado a «${ETIQUETA_ESTADO_POSTULACION[detalle.estado]}».`)
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : 'No pudimos cambiar el estado. Intenta de nuevo.')
    },
  })

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
        disabled={elegido === estadoActual || cambio.isPending}
        onClick={() => setConfirmando(true)}
      >
        {cambio.isPending ? 'Cambiando…' : 'Cambiar estado'}
      </Button>
      <ConfirmDialog
        abierto={confirmando}
        onAbiertoChange={setConfirmando}
        titulo={`¿Cambiar el estado a «${etiquetaElegida}»?`}
        descripcion="Se le avisará al candidato por correo con el nuevo estado."
        etiquetaConfirmar="Cambiar estado"
        onConfirmar={() => cambio.mutate(elegido)}
      />
    </div>
  )
}