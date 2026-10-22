import { zodResolver } from '@hookform/resolvers/zod'
import { KeyRound, MailCheck } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CaptchaTurnstile from '@/features/auth/CaptchaTurnstile'
import EncabezadoAuth from '@/features/auth/EncabezadoAuth'
import { solicitarRecuperacionApi } from '@/features/auth/recuperacionApi'
import {
  solicitarRecuperacionEsquema,
  type SolicitarRecuperacionDatos,
} from '@/features/auth/recuperacionEsquema'
import { ApiError } from '@/shared/api/apiError'
import { aplicarErroresServidor } from '@/shared/lib/erroresServidor'
import { RUTAS } from '@/shared/lib/rutas'
import FormField from '@/shared/ui/FormField'
import { claseEnlace } from '@/shared/ui/estilosEnlace'
import MensajeFormulario from '@/shared/ui/MensajeFormulario'
import PantallaEstado from '@/shared/ui/PantallaEstado'

// Pide el enlace de recuperación (HU-02 / FE-13).
// El mensaje de éxito es siempre el mismo: no revela si la cuenta existe.
export default function RecuperarContrasenaPage() {
  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<SolicitarRecuperacionDatos>({
    resolver: zodResolver(solicitarRecuperacionEsquema),
    defaultValues: { correo: '', captcha: '' },
  })

  // El token de la verificación sirve una sola vez: si el envío falla, se pide uno nuevo.
  const [intento, setIntento] = useState(0)

  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState<unknown>()

  async function solicitar(datos: SolicitarRecuperacionDatos) {
    setEnviando(true)
    setErrorEnvio(undefined)
    try {
      await solicitarRecuperacionApi(datos)
      setEnviado(true)
    } catch (error) {
      setErrorEnvio(error)
      aplicarErroresServidor(error, setError)
      setValue('captcha', '')
      setIntento((n) => n + 1)
    } finally {
      setEnviando(false)
    }
  }

  // Los errores de validación (422) van a cada campo; el resto se muestra arriba.
  const errorGeneral =
    errorEnvio instanceof ApiError
      ? errorEnvio.status !== 422
        ? errorEnvio.message
        : undefined
      : errorEnvio !== undefined
        ? 'No pudimos enviar el enlace.'
        : undefined

  if (enviado) {
    return (
      <PantallaEstado icono={MailCheck} tono="exito" titulo="Revisa tu correo">
        <p role="status" className="text-muted-foreground">
          Si el correo está registrado, te enviaremos un enlace para restablecer tu contraseña.
        </p>
        <Link to={RUTAS.iniciarSesion} className={claseEnlace}>
          Volver a iniciar sesión
        </Link>
      </PantallaEstado>
    )
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(solicitar)}
      className="space-y-5"
    >
      <EncabezadoAuth
        icono={KeyRound}
        titulo="Recuperar contraseña"
        descripcion="Escribe tu correo institucional y te enviaremos un enlace para crear una contraseña nueva."
      />

      {errorGeneral && <MensajeFormulario tipo="error">{errorGeneral}</MensajeFormulario>}

      <FormField id="correo" etiqueta="Correo institucional" error={errors.correo?.message}>
        {(campo) => <Input type="email" autoComplete="email" {...campo} {...register('correo')} />}
      </FormField>

      <Controller
        control={control}
        name="captcha"
        render={({ field }) => (
          <CaptchaTurnstile key={intento} onToken={field.onChange} error={errors.captcha?.message} />
        )}
      />

      <Button type="submit" className="w-full" disabled={enviando}>
        {enviando ? 'Enviando...' : 'Enviar enlace'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link to={RUTAS.iniciarSesion} className={claseEnlace}>
          Volver a iniciar sesión
        </Link>
      </p>
    </form>
  )
}