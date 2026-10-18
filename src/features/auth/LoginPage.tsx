import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginEsquema, type LoginDatos } from '@/features/auth/loginEsquema'
import { iniciarSesionApi } from '@/features/auth/loginApi'
import { destinoPermitido, rutaInicioPorRol } from '@/features/auth/rutaPorRol'
import { CLAVE_SESION } from '@/features/auth/sesionApi'
import type { Usuario } from '@/features/auth/tipos'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'
import FormField from '@/shared/ui/FormField'

// Solo se acepta volver a rutas internas de la app.
function destinoSeguro(desde: unknown): string | null {
  return typeof desde === 'string' && desde.startsWith('/') && !desde.startsWith('//') ? desde : null
}

// Formulario de inicio de sesión (HU-02 / FE-12).
export default function LoginPage() {
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const queryClient = useQueryClient()
  const desde = destinoSeguro((ubicacion.state as { desde?: unknown } | null)?.desde)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDatos>({
    resolver: zodResolver(loginEsquema),
    defaultValues: { correo: '', contrasena: '' },
  })

  const login = useMutation({
    mutationFn: iniciarSesionApi,
    onSuccess: async () => {
      // Vuelve a consultar la sesión y, con el rol, decide a dónde ir.
      await queryClient.invalidateQueries({ queryKey: CLAVE_SESION })
      const usuario = queryClient.getQueryData<Usuario | null>(CLAVE_SESION)
      const destino = usuario ? (destinoPermitido(desde, usuario.rol) ?? rutaInicioPorRol(usuario.rol)) : (desde ?? RUTAS.raiz)
      navegar(destino, { replace: true })
    },
  })

  const mensajeError = login.error instanceof ApiError ? login.error.message : undefined

  return (
    <form
      noValidate
      onSubmit={handleSubmit((datos) => login.mutate(datos))}
      className="mx-auto max-w-sm space-y-4"
    >
      <h1 className="text-2xl font-bold">Iniciar sesión</h1>

      {mensajeError && (
        <p role="alert" className="text-sm text-destructive">
          {mensajeError}
        </p>
      )}

      <FormField id="correo" etiqueta="Correo institucional" error={errors.correo?.message}>
        {(campo) => <Input type="email" autoComplete="email" {...campo} {...register('correo')} />}
      </FormField>

      <FormField id="contrasena" etiqueta="Contraseña" error={errors.contrasena?.message}>
        {(campo) => (
          <Input type="password" autoComplete="current-password" {...campo} {...register('contrasena')} />
        )}
      </FormField>

      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending ? 'Entrando...' : 'Entrar'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link to={RUTAS.recuperarContrasena} className="underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link to={RUTAS.registro} className="underline">
          Regístrate
        </Link>
      </p>
    </form>
  )
}