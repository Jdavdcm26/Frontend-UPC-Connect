import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { reenviarVerificacionApi } from '@/features/auth/verificacionApi'
import { ApiError } from '@/shared/api/apiError'
import { correo } from '@/shared/lib/validaciones'
import FormField from '@/shared/ui/FormField'
import MensajeFormulario from '@/shared/ui/MensajeFormulario'

const esquema = z.object({ correo })
type Datos = z.infer<typeof esquema>

// Pide un enlace de verificación nuevo cuando el anterior venció (FE-11).
export default function ReenviarVerificacion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Datos>({ resolver: zodResolver(esquema), defaultValues: { correo: '' } })

  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<unknown>()

  async function reenviar(datos: Datos) {
    setEnviando(true)
    setEnviado(false)
    setError(undefined)
    try {
      await reenviarVerificacionApi(datos.correo)
      setEnviado(true)
    } catch (e) {
      setError(e ?? new Error())
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit(reenviar)} className="space-y-3 text-left">
      <FormField id="correo-reenvio" etiqueta="Correo institucional" error={errors.correo?.message}>
        {(campo) => <Input type="email" autoComplete="email" {...campo} {...register('correo')} />}
      </FormField>

      {error !== undefined && (
        <MensajeFormulario tipo="error">
          {error instanceof ApiError ? error.message : 'No pudimos enviar el enlace.'}
        </MensajeFormulario>
      )}
      {enviado && <MensajeFormulario tipo="exito">Listo, te enviamos un nuevo enlace. Revisa tu correo.</MensajeFormulario>}

      <Button type="submit" className="w-full" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Reenviar enlace'}
      </Button>
    </form>
  )
}