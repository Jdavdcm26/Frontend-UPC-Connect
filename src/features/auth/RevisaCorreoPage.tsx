import { MailCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import ReenviarVerificacion from '@/features/auth/ReenviarVerificacion'
import { reenviarVerificacionApi } from '@/features/auth/verificacionApi'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'
import { claseEnlace } from '@/shared/ui/estilosEnlace'
import MensajeFormulario from '@/shared/ui/MensajeFormulario'
import PantallaEstado from '@/shared/ui/PantallaEstado'

// Pantalla posterior al registro (HU-01 / FE-10): pide revisar el correo y permite reenviarlo.
export default function RevisaCorreoPage() {
  const ubicacion = useLocation()
  const correo = (ubicacion.state as { correo?: string } | null)?.correo
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<unknown>()

  async function reenviar(destino: string) {
    setEnviando(true)
    setEnviado(false)
    setError(undefined)
    try {
      await reenviarVerificacionApi(destino)
      setEnviado(true)
    } catch (e) {
      setError(e ?? new Error())
    } finally {
      setEnviando(false)
    }
  }

  return (
    <PantallaEstado icono={MailCheck} tono="exito" titulo="Revisa tu correo">
      <p className="text-muted-foreground">
        {correo
          ? `Te enviamos un enlace de verificación a ${correo}.`
          : 'Te enviamos un enlace de verificación a tu correo.'}{' '}
        Ábrelo para activar tu cuenta.
      </p>

      <div className="w-full space-y-3">
        <p className="text-sm text-muted-foreground">¿No te llegó?</p>
        {correo ? (
          <>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={enviando}
              onClick={() => void reenviar(correo)}
            >
              {enviando ? 'Enviando...' : 'Reenviar enlace'}
            </Button>
            {enviado && <MensajeFormulario tipo="exito">Listo, te enviamos un nuevo enlace.</MensajeFormulario>}
            {error !== undefined && (
              <MensajeFormulario tipo="error">
                {error instanceof ApiError ? error.message : 'No pudimos enviar el enlace.'}
              </MensajeFormulario>
            )}
          </>
        ) : (
          <ReenviarVerificacion />
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        ¿Ya verificaste?{' '}
        <Link to={RUTAS.iniciarSesion} className={claseEnlace}>
          Inicia sesión
        </Link>
      </p>
    </PantallaEstado>
  )
}