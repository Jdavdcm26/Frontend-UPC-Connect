import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { RUTAS } from '@/shared/lib/rutas'

// Pantalla posterior al registro (HU-01 / FE-10): pide revisar el correo.
export default function RevisaCorreoPage() {
  const ubicacion = useLocation()
  const correo = (ubicacion.state as { correo?: string } | null)?.correo

  return (
    <section className="mx-auto max-w-sm space-y-4 text-center">
      <h1 className="text-2xl font-bold">Revisa tu correo</h1>
      <p className="text-muted-foreground">
        {correo
          ? `Te enviamos un enlace de verificación a ${correo}.`
          : 'Te enviamos un enlace de verificación a tu correo.'}{' '}
        Ábrelo para activar tu cuenta.
      </p>
      <p className="text-sm text-muted-foreground">
        ¿Ya verificaste?{' '}
        <Link to={RUTAS.iniciarSesion} className="underline">
          Inicia sesión
        </Link>
      </p>
    </section>
  )
}