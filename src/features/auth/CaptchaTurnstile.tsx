import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { USAR_FIXTURES } from '@/features/auth/sesionApi'
import { CLAVE_TURNSTILE, cargarTurnstile } from '@/features/auth/turnstile'

type Props = {
  // Recibe el token cuando la persona pasa la verificación, y '' si vence o falla.
  onToken: (token: string) => void
  error?: string
}

// Verificación de seguridad de Cloudflare Turnstile (HU-01 y HU-02).
// El token sirve una sola vez: tras un intento fallido, el formulario vuelve a montar este
// componente (cambiando su "key") para pedir uno nuevo.
export default function CaptchaTurnstile({ onToken, error }: Props) {
  const contenedor = useRef<HTMLDivElement>(null)
  const [noCargo, setNoCargo] = useState(false)
  // Siempre llama a la versión más reciente de onToken sin reiniciar el widget.
  const avisarToken = useEffectEvent((token: string) => onToken(token))

  useEffect(() => {
    // Sin backend (fixtures) no se llama a Cloudflare: se entrega un token de demostración.
    if (USAR_FIXTURES) {
      avisarToken('token-demo')
      return
    }
    if (!CLAVE_TURNSTILE) return

    let idWidget: string | undefined
    let desmontado = false
    cargarTurnstile()
      .then((turnstile) => {
        if (desmontado || !contenedor.current) return
        idWidget = turnstile.render(contenedor.current, {
          sitekey: CLAVE_TURNSTILE,
          language: 'es',
          theme: 'auto',
          callback: (token) => avisarToken(token),
          'expired-callback': () => avisarToken(''),
          'error-callback': () => avisarToken(''),
        })
      })
      .catch(() => {
        if (!desmontado) setNoCargo(true)
      })

    return () => {
      desmontado = true
      if (idWidget) window.turnstile?.remove(idWidget)
    }
  }, [])

  let contenido
  if (USAR_FIXTURES) {
    contenido = <p className="text-sm text-muted-foreground">Verificación de seguridad simulada (modo demostración).</p>
  } else if (!CLAVE_TURNSTILE) {
    contenido = (
      <p role="alert" className="text-sm text-destructive">
        Falta configurar la clave de Turnstile (VITE_TURNSTILE_SITE_KEY).
      </p>
    )
  } else if (noCargo) {
    contenido = (
      <p role="alert" className="text-sm text-destructive">
        No pudimos cargar la verificación de seguridad. Revisa tu conexión y recarga la página.
      </p>
    )
  } else {
    contenido = <div ref={contenedor} data-testid="turnstile" />
  }

  return (
    <div className="space-y-1.5">
      {contenido}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
