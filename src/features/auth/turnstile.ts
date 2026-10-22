// Cloudflare Turnstile: la verificación de seguridad (captcha) que exige el backend
// al registrarse y al pedir el enlace de recuperación.

// Clave pública del sitio. Se define en .env.local (VITE_TURNSTILE_SITE_KEY).
// Para desarrollo sirve la clave de prueba de Cloudflare: 1x00000000000000000000AA.
export const CLAVE_TURNSTILE: string = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? ''

const URL_SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

// Parte de la API de Cloudflare que usamos.
type OpcionesTurnstile = {
  sitekey: string
  language: string
  theme: 'auto'
  callback: (token: string) => void
  'expired-callback': () => void
  'error-callback': () => void
}

export type ApiTurnstile = {
  render: (contenedor: HTMLElement, opciones: OpcionesTurnstile) => string
  remove: (idWidget: string) => void
}

declare global {
  interface Window {
    turnstile?: ApiTurnstile
  }
}

let carga: Promise<ApiTurnstile> | null = null

// Descarga el script de Cloudflare una sola vez, aunque haya varios formularios.
export function cargarTurnstile(): Promise<ApiTurnstile> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  carga ??= new Promise<ApiTurnstile>((resolver, rechazar) => {
    const script = document.createElement('script')
    script.src = URL_SCRIPT
    script.async = true
    script.onload = () => (window.turnstile ? resolver(window.turnstile) : rechazar(new Error('Turnstile no cargó')))
    script.onerror = () => {
      // Si falla (sin internet), se permite reintentar al volver a abrir el formulario.
      carga = null
      script.remove()
      rechazar(new Error('Turnstile no cargó'))
    }
    document.head.appendChild(script)
  })
  return carga
}
