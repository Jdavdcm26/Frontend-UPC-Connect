import { zodResolver } from '@hookform/resolvers/zod'
import { Send } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { LIMITES_POSTULACION } from '@/features/postulaciones/limites'
import { postulacionEsquema, type PostulacionDatos } from '@/features/postulaciones/postulacionEsquema'
import { postularse } from '@/features/postulaciones/postulacionesApi'
import { ApiError } from '@/shared/api/apiError'
import FormField from '@/shared/ui/FormField'

type Props = {
  vacanteId: string
  vacanteTitulo: string
  // Con éxito o con error, la página vuelve a pedir la vacante para mostrar lo que dice el servidor.
  onPostulado: () => void
}

type FormularioProps = Props & {
  // Se llama cuando termina el envío (con éxito), para cerrar la ventana.
  onTerminado: () => void
}

// Formulario con el mensaje opcional. Vive dentro de la ventana, así que se vacía al cerrarla.
function FormularioPostulacion({ vacanteId, vacanteTitulo, onPostulado, onTerminado }: FormularioProps) {
  const [enviando, setEnviando] = useState(false)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PostulacionDatos>({
    resolver: zodResolver(postulacionEsquema),
    defaultValues: { mensaje: '' },
  })

  async function enviar(datos: PostulacionDatos) {
    setEnviando(true)
    try {
      await postularse(vacanteId, datos.mensaje)
      toast.success('Te postulaste a la vacante.')
      onTerminado()
    } catch (error) {
      // El aviso queda como notificación porque, si ya estabas postulado o la vacante se cerró,
      // esta ventana desaparece al actualizarse el detalle.
      toast.error(error instanceof ApiError ? error.message : 'No pudimos enviar tu postulación. Intenta de nuevo.')
    } finally {
      setEnviando(false)
      onPostulado()
    }
  }

  const escritos = useWatch({ control, name: 'mensaje' }).length

  return (
    <form noValidate onSubmit={handleSubmit(enviar)} className="min-w-0 space-y-4">
      <DialogHeader>
        <DialogTitle>Postularme</DialogTitle>
        <DialogDescription>
          Vas a postularte a «{vacanteTitulo}». Puedes añadir un mensaje para la empresa, pero no es obligatorio.
        </DialogDescription>
      </DialogHeader>

      <FormField
        id="mensaje"
        etiqueta="Mensaje (opcional)"
        ayuda={`${escritos}/${LIMITES_POSTULACION.mensaje} caracteres`}
        error={errors.mensaje?.message}
      >
        {(campo) => <Textarea rows={5} className="field-sizing-fixed" {...campo} {...register('mensaje')} />}
      </FormField>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onTerminado} disabled={enviando}>
          Cancelar
        </Button>
        <Button type="submit" disabled={enviando}>
          <Send aria-hidden="true" />
          {enviando ? 'Enviando…' : 'Enviar postulación'}
        </Button>
      </DialogFooter>
    </form>
  )
}

// Botón "Postularme" que abre la ventana con el mensaje opcional (HU-45 / FE-23).
export default function ApplyDialog({ vacanteId, vacanteTitulo, onPostulado }: Props) {
  const [abierto, setAbierto] = useState(false)

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full">
          <Send aria-hidden="true" />
          Postularme
        </Button>
      </DialogTrigger>
      <DialogContent>
        <FormularioPostulacion
          vacanteId={vacanteId}
          vacanteTitulo={vacanteTitulo}
          onPostulado={onPostulado}
          onTerminado={() => setAbierto(false)}
        />
      </DialogContent>
    </Dialog>
  )
}