import { useQuery } from '@tanstack/react-query'
import { Link, useLocation } from 'react-router-dom'
import ReenviarVerificacion from '@/features/auth/ReenviarVerificacion'
import { verificarCorreoApi } from '@/features/auth/verificacionApi'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'

// Destino del enlace del correo (HU-02 / FE-11): verifica la cuenta al abrirse.
// Sin parámetros en la URL solo muestra un aviso; con parámetros muestra el resultado.
export default function VerificarCorreoPage() {
  const { search } = useLocation()
  const hayEnlace = search !== ''

  // useQuery evita verificar dos veces el mismo enlace (el segundo intento fallaría).
  const verificacion = useQuery({
    queryKey: ['verificar-correo', search],
    queryFn: async () => {
      await verificarCorreoApi(search)
      return true
    },
    enabled: hayEnlace,
    retry: false,
    staleTime: Infinity,
  })

  if (!hayEnlace) {
    return (
      <section className="mx-auto max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold">Verifica tu correo</h1>
        <p className="text-muted-foreground">
          Abre el enlace que te enviamos al correo para activar tu cuenta.
        </p>
        <p className="text-sm text-muted-foreground">¿No te llegó? Pide uno nuevo:</p>
        <ReenviarVerificacion />
      </section>
    )
  }

  if (verificacion.isPending) {
    return (
      <p role="status" className="text-center text-muted-foreground">
        Verificando tu correo...
      </p>
    )
  }

  if (verificacion.isError) {
    const mensaje =
      verificacion.error instanceof ApiError
        ? verificacion.error.message
        : 'No pudimos verificar tu correo.'
    return (
      <section className="mx-auto max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold">No pudimos verificar tu correo</h1>
        <p role="alert" className="text-muted-foreground">
          {mensaje}
        </p>
        <ReenviarVerificacion />
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-sm space-y-4 text-center">
      <h1 className="text-2xl font-bold">Correo verificado</h1>
      <p className="text-muted-foreground">Tu cuenta quedó lista. Ya puedes iniciar sesión.</p>
      <Link to={RUTAS.iniciarSesion} className="underline">
        Ir a iniciar sesión
      </Link>
    </section>
  )
}