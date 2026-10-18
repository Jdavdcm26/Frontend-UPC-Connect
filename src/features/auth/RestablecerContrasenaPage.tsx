import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PasswordField from '@/features/auth/PasswordField'
import { restablecerContrasenaApi } from '@/features/auth/recuperacionApi'
import { restablecerEsquema, type RestablecerDatos } from '@/features/auth/recuperacionEsquema'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'
import FormField from '@/shared/ui/FormField'

// Contraseña nueva, llegando desde el enlace del correo (HU-02 / FE-13).
export default function RestablecerContrasenaPage() {
  const { search } = useLocation()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RestablecerDatos>({
    resolver: zodResolver(restablecerEsquema),
    defaultValues: { contrasena: '', confirmacion: '' },
  })

  const contrasenaEscrita = useWatch({ control, name: 'contrasena' })

  const cambio = useMutation({
    mutationFn: (datos: RestablecerDatos) => restablecerContrasenaApi(search, datos),
  })

  if (cambio.isSuccess) {
    return (
      <section className="mx-auto max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold">Contraseña actualizada</h1>
        <p role="status" className="text-muted-foreground">
          Ya puedes iniciar sesión con tu contraseña nueva.
        </p>
        <Link to={RUTAS.iniciarSesion} className="underline">
          Ir a iniciar sesión
        </Link>
      </section>
    )
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit((datos) => cambio.mutate(datos))}
      className="mx-auto max-w-sm space-y-4"
    >
      <h1 className="text-2xl font-bold">Crear contraseña nueva</h1>

      {cambio.isError && (
        <div role="alert" className="space-y-1 text-sm text-destructive">
          <p>{cambio.error instanceof ApiError ? cambio.error.message : 'No pudimos cambiar la contraseña.'}</p>
          <Link to={RUTAS.recuperarContrasena} className="underline">
            Pedir un enlace nuevo
          </Link>
        </div>
      )}

      <PasswordField
        id="contrasena"
        etiqueta="Contraseña nueva"
        valor={contrasenaEscrita}
        registro={register('contrasena')}
        error={errors.contrasena?.message}
      />

      <FormField id="confirmacion" etiqueta="Confirmar contraseña" error={errors.confirmacion?.message}>
        {(campo) => (
          <Input type="password" autoComplete="new-password" {...campo} {...register('confirmacion')} />
        )}
      </FormField>

      <Button type="submit" className="w-full" disabled={cambio.isPending}>
        {cambio.isPending ? 'Guardando...' : 'Guardar contraseña'}
      </Button>
    </form>
  )
}