import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registroEsquema, type RegistroDatos } from '@/features/auth/registroEsquema'
import { registrarApi } from '@/features/auth/registroApi'
import { ApiError } from '@/shared/api/apiError'
import { aplicarErroresServidor } from '@/shared/lib/erroresServidor'
import { RUTAS } from '@/shared/lib/rutas'
import FormField from '@/shared/ui/FormField'

// Formulario de registro (HU-01 / FE-10).
export default function RegistroPage() {
  const navegar = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegistroDatos>({
    resolver: zodResolver(registroEsquema),
    defaultValues: { correo: '', contrasena: '', confirmacion: '' },
  })

  const registro = useMutation({
    mutationFn: registrarApi,
    // Al registrarse, pasa a "Revisa tu correo" llevando el correo escrito.
    onSuccess: (_resultado, datos) =>
      navegar(RUTAS.revisaCorreo, { state: { correo: datos.correo } }),
    // Los errores de validación (422) van a cada campo; el resto se muestra arriba.
    onError: (error) => {
      aplicarErroresServidor(error, setError)
    },
  })

  const errorGeneral =
    registro.error instanceof ApiError && registro.error.status !== 422
      ? registro.error.message
      : undefined

  return (
    <form
      noValidate
      onSubmit={handleSubmit((datos) => registro.mutate(datos))}
      className="mx-auto max-w-sm space-y-4"
    >
      <h1 className="text-2xl font-bold">Crear cuenta</h1>

      {errorGeneral && (
        <p role="alert" className="text-sm text-destructive">
          {errorGeneral}
        </p>
      )}

      <FormField id="correo" etiqueta="Correo institucional" error={errors.correo?.message}>
        {(campo) => <Input type="email" autoComplete="email" {...campo} {...register('correo')} />}
      </FormField>

      <FormField
        id="contrasena"
        etiqueta="Contraseña"
        ayuda="Mínimo 10 caracteres."
        error={errors.contrasena?.message}
      >
        {(campo) => (
          <Input type="password" autoComplete="new-password" {...campo} {...register('contrasena')} />
        )}
      </FormField>

      <FormField id="confirmacion" etiqueta="Confirmar contraseña" error={errors.confirmacion?.message}>
        {(campo) => (
          <Input type="password" autoComplete="new-password" {...campo} {...register('confirmacion')} />
        )}
      </FormField>

      <Button type="submit" className="w-full" disabled={registro.isPending}>
        {registro.isPending ? 'Creando cuenta...' : 'Registrarme'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link to={RUTAS.iniciarSesion} className="underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}