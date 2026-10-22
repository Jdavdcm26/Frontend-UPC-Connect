import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import CaptchaTurnstile from '@/features/auth/CaptchaTurnstile'
import ConsentCheckbox from '@/features/auth/ConsentCheckbox'
import EncabezadoAuth from '@/features/auth/EncabezadoAuth'
import PasswordField from '@/features/auth/PasswordField'
import { registroEsquema, type RegistroDatos } from '@/features/auth/registroEsquema'
import { registrarApi } from '@/features/auth/registroApi'
import { ApiError } from '@/shared/api/apiError'
import { aplicarErroresServidor } from '@/shared/lib/erroresServidor'
import { RUTAS } from '@/shared/lib/rutas'
import FormField from '@/shared/ui/FormField'
import { claseEnlace } from '@/shared/ui/estilosEnlace'
import MensajeFormulario from '@/shared/ui/MensajeFormulario'

// Formulario de registro (HU-01 / FE-10).
export default function RegistroPage() {
  const navegar = useNavigate()
  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<RegistroDatos>({
    resolver: zodResolver(registroEsquema),
    defaultValues: { correo: '', contrasena: '', confirmacion: '', aceptaPolitica: false, captcha: '' },
  })

  const contrasenaEscrita = useWatch({ control, name: 'contrasena' })

  // Se registran en el orden en que se ven: así, al fallar el envío, el foco va al primer campo con error.
  const campoCorreo = register('correo')
  const campoContrasena = register('contrasena')
  const campoConfirmacion = register('confirmacion')

  // El token de la verificación sirve una sola vez: si el registro falla, se pide uno nuevo.
  const [intento, setIntento] = useState(0)

  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState<unknown>()

  async function registrarse(datos: RegistroDatos) {
    setEnviando(true)
    setErrorEnvio(undefined)
    try {
      await registrarApi(datos)
      // Al registrarse, pasa a "Revisa tu correo" llevando el correo escrito.
      navegar(RUTAS.revisaCorreo, { state: { correo: datos.correo } })
    } catch (error) {
      // Los errores de validación (422) van a cada campo; el resto se muestra arriba.
      setErrorEnvio(error)
      aplicarErroresServidor(error, setError)
      setValue('captcha', '')
      setIntento((n) => n + 1)
      setEnviando(false)
    }
  }

  const errorGeneral =
    errorEnvio instanceof ApiError && errorEnvio.status !== 422 ? errorEnvio.message : undefined

  return (
    <form
      noValidate
      onSubmit={handleSubmit(registrarse)}
      className="space-y-5"
    >
      <EncabezadoAuth
        icono={UserPlus}
        titulo="Crear cuenta"
        descripcion="Regístrate con el correo institucional de tu universidad, por ejemplo nombre@unicesar.edu.co."
      />

      {errorGeneral && <MensajeFormulario tipo="error">{errorGeneral}</MensajeFormulario>}

      <FormField id="correo" etiqueta="Correo institucional" error={errors.correo?.message}>
        {(campo) => <Input type="email" autoComplete="email" {...campo} {...campoCorreo} />}
      </FormField>

      <PasswordField
        id="contrasena"
        etiqueta="Contraseña"
        valor={contrasenaEscrita}
        registro={campoContrasena}
        error={errors.contrasena?.message}
      />

      <FormField id="confirmacion" etiqueta="Confirmar contraseña" error={errors.confirmacion?.message}>
        {(campo) => (
          <Input type="password" autoComplete="new-password" {...campo} {...campoConfirmacion} />
        )}
      </FormField>

      <Controller
        control={control}
        name="aceptaPolitica"
        render={({ field }) => (
          <ConsentCheckbox
            checked={field.value}
            onChange={field.onChange}
            error={errors.aceptaPolitica?.message}
            inputRef={field.ref}
          />
        )}
      />

      <Controller
        control={control}
        name="captcha"
        render={({ field }) => (
          <CaptchaTurnstile key={intento} onToken={field.onChange} error={errors.captcha?.message} />
        )}
      />

      <Button type="submit" className="w-full" disabled={enviando}>
        {enviando ? 'Creando cuenta...' : 'Registrarme'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link to={RUTAS.iniciarSesion} className={claseEnlace}>
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}