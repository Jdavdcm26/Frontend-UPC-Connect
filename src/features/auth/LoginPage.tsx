import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import EncabezadoAuth from '@/features/auth/EncabezadoAuth'
import { loginEsquema, type LoginDatos } from '@/features/auth/loginEsquema'
import { iniciarSesionApi } from '@/features/auth/loginApi'
import { destinoPermitido, rutaInicioPorRol } from '@/features/auth/rutaPorRol'
import { useSession } from '@/features/auth/useSession'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'
import FormField from '@/shared/ui/FormField'
import { claseEnlace } from '@/shared/ui/estilosEnlace'
import MensajeFormulario from '@/shared/ui/MensajeFormulario'

// Solo se acepta volver a rutas internas de la app.
function destinoSeguro(desde: unknown): string | null {
  return typeof desde === 'string' && desde.startsWith('/') && !desde.startsWith('//') ? desde : null
}

// Formulario de inicio de sesión (HU-02 / FE-12).
export default function LoginPage() {
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const { refrescarSesion } = useSession()
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<unknown>()
  const desde = destinoSeguro((ubicacion.state as { desde?: unknown } | null)?.desde)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDatos>({
    resolver: zodResolver(loginEsquema),
    defaultValues: { correo: '', contrasena: '' },
  })

  async function iniciarSesion(datos: LoginDatos) {
    setEnviando(true)
    setError(undefined)
    try {
      await iniciarSesionApi(datos)
      // Vuelve a consultar la sesión y, con el rol, decide a dónde ir.
      const usuario = await refrescarSesion()
      const destino = usuario ? (destinoPermitido(desde, usuario.rol) ?? rutaInicioPorRol(usuario.rol)) : (desde ?? RUTAS.raiz)
      navegar(destino, { replace: true })
    } catch (e) {
      setError(e)
      setEnviando(false)
    }
  }

  const mensajeError = error instanceof ApiError ? error.message : undefined

  return (
    <form
      noValidate
      onSubmit={handleSubmit(iniciarSesion)}
      className="space-y-5"
    >
      <EncabezadoAuth
        icono={LogIn}
        titulo="Iniciar sesión"
        descripcion="Entra con tu correo institucional y tu contraseña."
      />

      {mensajeError && <MensajeFormulario tipo="error">{mensajeError}</MensajeFormulario>}

      <FormField id="correo" etiqueta="Correo institucional" error={errors.correo?.message}>
        {(campo) => <Input type="email" autoComplete="email" {...campo} {...register('correo')} />}
      </FormField>

      <FormField id="contrasena" etiqueta="Contraseña" error={errors.contrasena?.message}>
        {(campo) => (
          <Input type="password" autoComplete="current-password" {...campo} {...register('contrasena')} />
        )}
      </FormField>

      <Button type="submit" className="w-full" disabled={enviando}>
        {enviando ? 'Entrando...' : 'Entrar'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link to={RUTAS.recuperarContrasena} className={claseEnlace}>
          ¿Olvidaste tu contraseña?
        </Link>
      </p>
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link to={RUTAS.registro} className={claseEnlace}>
          Regístrate
        </Link>
      </p>
    </form>
  )
}