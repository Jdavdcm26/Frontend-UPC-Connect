import { zodResolver } from '@hookform/resolvers/zod'
import { BadgeCheck, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import EncabezadoAuth from '@/features/auth/EncabezadoAuth'
import PasswordField from '@/features/auth/PasswordField'
import { restablecerContrasenaApi } from '@/features/auth/recuperacionApi'
import { restablecerEsquema, type RestablecerDatos } from '@/features/auth/recuperacionEsquema'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'
import FormField from '@/shared/ui/FormField'
import { claseEnlace } from '@/shared/ui/estilosEnlace'
import MensajeFormulario from '@/shared/ui/MensajeFormulario'
import PantallaEstado from '@/shared/ui/PantallaEstado'

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

  const [enviando, setEnviando] = useState(false)
  const [cambiada, setCambiada] = useState(false)
  const [error, setError] = useState<unknown>()

  async function guardar(datos: RestablecerDatos) {
    setEnviando(true)
    setError(undefined)
    try {
      await restablecerContrasenaApi(search, datos)
      setCambiada(true)
    } catch (e) {
      setError(e ?? new Error())
    } finally {
      setEnviando(false)
    }
  }

  if (cambiada) {
    return (
      <PantallaEstado icono={BadgeCheck} tono="exito" titulo="Contraseña actualizada">
        <p role="status" className="text-muted-foreground">
          Ya puedes iniciar sesión con tu contraseña nueva.
        </p>
        <Button asChild>
          <Link to={RUTAS.iniciarSesion}>Ir a iniciar sesión</Link>
        </Button>
      </PantallaEstado>
    )
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(guardar)}
      className="space-y-5"
    >
      <EncabezadoAuth
        icono={LockKeyhole}
        titulo="Crear contraseña nueva"
        descripcion="Elige una contraseña que no uses en otros sitios."
      />

      {error !== undefined && (
        <MensajeFormulario tipo="error">
          <p>{error instanceof ApiError ? error.message : 'No pudimos cambiar la contraseña.'}</p>
          <Link to={RUTAS.recuperarContrasena} className={claseEnlace}>
            Pedir un enlace nuevo
          </Link>
        </MensajeFormulario>
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

      <Button type="submit" className="w-full" disabled={enviando}>
        {enviando ? 'Guardando...' : 'Guardar contraseña'}
      </Button>
    </form>
  )
}