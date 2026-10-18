import { useMutation } from '@tanstack/react-query'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import ReenviarVerificacion from '@/features/auth/ReenviarVerificacion'
import { reenviarVerificacionApi } from '@/features/auth/verificacionApi'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'

// Pantalla posterior al registro (HU-01 / FE-10): pide revisar el correo y permite reenviarlo.
export default function RevisaCorreoPage() {
  const ubicacion = useLocation()
  const correo = (ubicacion.state as { correo?: string } | null)?.correo
  const reenvio = useMutation({ mutationFn: reenviarVerificacionApi })

  return (
    <section className="mx-auto max-w-sm space-y-4 text-center">
      <h1 className="text-2xl font-bold">Revisa tu correo</h1>
      <p className="text-muted-foreground">
        {correo
          ? `Te enviamos un enlace de verificación a ${correo}.`
          : 'Te enviamos un enlace de verificación a tu correo.'}{' '}
        Ábrelo para activar tu cuenta.
      </p>

      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">¿No te llegó?</p>
        {correo ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={reenvio.isPending}
              onClick={() => reenvio.mutate(correo)}
            >
              {reenvio.isPending ? 'Enviando...' : 'Reenviar enlace'}
            </Button>
            {reenvio.isSuccess && (
              <p role="status" className="text-sm text-muted-foreground">
                Listo, te enviamos un nuevo enlace.
              </p>
            )}
            {reenvio.isError && (
              <p role="alert" className="text-sm text-destructive">
                {reenvio.error instanceof ApiError ? reenvio.error.message : 'No pudimos enviar el enlace.'}
              </p>
            )}
          </>
        ) : (
          <ReenviarVerificacion />
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        ¿Ya verificaste?{' '}
        <Link to={RUTAS.iniciarSesion} className="underline">
          Inicia sesión
        </Link>
      </p>
    </section>
  )
}