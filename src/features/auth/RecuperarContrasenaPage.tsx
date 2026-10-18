import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { solicitarRecuperacionApi } from '@/features/auth/recuperacionApi'
import {
  solicitarRecuperacionEsquema,
  type SolicitarRecuperacionDatos,
} from '@/features/auth/recuperacionEsquema'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'
import FormField from '@/shared/ui/FormField'

// Pide el enlace de recuperación (HU-02 / FE-13).
// El mensaje de éxito es siempre el mismo: no revela si la cuenta existe.
export default function RecuperarContrasenaPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SolicitarRecuperacionDatos>({
    resolver: zodResolver(solicitarRecuperacionEsquema),
    defaultValues: { correo: '' },
  })

  const solicitud = useMutation({ mutationFn: solicitarRecuperacionApi })

  if (solicitud.isSuccess) {
    return (
      <section className="mx-auto max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold">Revisa tu correo</h1>
        <p role="status" className="text-muted-foreground">
          Si el correo está registrado, te enviaremos un enlace para restablecer tu contraseña.
        </p>
        <Link to={RUTAS.iniciarSesion} className="underline">
          Volver a iniciar sesión
        </Link>
      </section>
    )
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((datos) => solicitud.mutate(datos.correo))}
      className="mx-auto max-w-sm space-y-4"
    >
      <h1 className="text-2xl font-bold">Recuperar contraseña</h1>
      <p className="text-sm text-muted-foreground">
        Escribe tu correo institucional y te enviaremos un enlace para crear una contraseña nueva.
      </p>

      {solicitud.isError && (
        <p role="alert" className="text-sm text-destructive">
          {solicitud.error instanceof ApiError ? solicitud.error.message : 'No pudimos enviar el enlace.'}
        </p>
      )}

      <FormField id="correo" etiqueta="Correo institucional" error={errors.correo?.message}>
        {(campo) => <Input type="email" autoComplete="email" {...campo} {...register('correo')} />}
      </FormField>

      <Button type="submit" className="w-full" disabled={solicitud.isPending}>
        {solicitud.isPending ? 'Enviando...' : 'Enviar enlace'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link to={RUTAS.iniciarSesion} className="underline">
          Volver a iniciar sesión
        </Link>
      </p>
    </form>
  )
}