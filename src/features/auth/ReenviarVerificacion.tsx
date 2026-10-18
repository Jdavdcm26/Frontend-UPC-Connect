import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { reenviarVerificacionApi } from '@/features/auth/verificacionApi'
import { ApiError } from '@/shared/api/apiError'
import { correo } from '@/shared/lib/validaciones'
import FormField from '@/shared/ui/FormField'

const esquema = z.object({ correo })
type Datos = z.infer<typeof esquema>

// Pide un enlace de verificación nuevo cuando el anterior venció (FE-11).
export default function ReenviarVerificacion() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Datos>({ resolver: zodResolver(esquema), defaultValues: { correo: '' } })

  const reenvio = useMutation({ mutationFn: reenviarVerificacionApi })

  return (
    <form
      noValidate
      onSubmit={handleSubmit((datos) => reenvio.mutate(datos.correo))}
      className="space-y-3 text-left"
    >
      <FormField id="correo-reenvio" etiqueta="Correo institucional" error={errors.correo?.message}>
        {(campo) => <Input type="email" autoComplete="email" {...campo} {...register('correo')} />}
      </FormField>

      {reenvio.isError && (
        <p role="alert" className="text-sm text-destructive">
          {reenvio.error instanceof ApiError ? reenvio.error.message : 'No pudimos enviar el enlace.'}
        </p>
      )}
      {reenvio.isSuccess && (
        <p role="status" className="text-sm text-muted-foreground">
          Listo, te enviamos un nuevo enlace. Revisa tu correo.
        </p>
      )}

      <Button type="submit" className="w-full" disabled={reenvio.isPending}>
        {reenvio.isPending ? 'Enviando...' : 'Enviar nuevo enlace'}
      </Button>
    </form>
  )
}