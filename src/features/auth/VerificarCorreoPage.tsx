import { BadgeCheck, LoaderCircle, Mail, MailX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import ReenviarVerificacion from '@/features/auth/ReenviarVerificacion'
import { verificarCorreoApi } from '@/features/auth/verificacionApi'
import { ApiError } from '@/shared/api/apiError'
import { RUTAS } from '@/shared/lib/rutas'
import MensajeFormulario from '@/shared/ui/MensajeFormulario'
import PantallaEstado from '@/shared/ui/PantallaEstado'

// Destino del enlace del correo (HU-02 / FE-11): verifica la cuenta al abrirse.
// Sin parámetros en la URL solo muestra un aviso; con parámetros muestra el resultado.
export default function VerificarCorreoPage() {
  const { search } = useLocation()
  const hayEnlace = search !== ''

  const [verificado, setVerificado] = useState(false)
  const [error, setError] = useState<unknown>()

  // El enlace sirve una sola vez: el segundo intento fallaría. En modo estricto React ejecuta
  // los efectos dos veces al montar, así que esta referencia evita repetir la petición.
  const yaPedido = useRef(false)

  useEffect(() => {
    if (!hayEnlace || yaPedido.current) return
    yaPedido.current = true
    verificarCorreoApi(search)
      .then(() => setVerificado(true))
      .catch((e) => setError(e ?? new Error()))
  }, [hayEnlace, search])

  if (!hayEnlace) {
    return (
      <PantallaEstado icono={Mail} titulo="Verifica tu correo">
        <p className="text-muted-foreground">
          Abre el enlace que te enviamos al correo para activar tu cuenta.
        </p>
        <p className="text-sm text-muted-foreground">¿No te llegó? Pide uno nuevo:</p>
        <div className="w-full">
          <ReenviarVerificacion />
        </div>
      </PantallaEstado>
    )
  }

  if (error !== undefined) {
    const mensaje = error instanceof ApiError ? error.message : 'No pudimos verificar tu correo.'
    return (
      <PantallaEstado icono={MailX} tono="error" titulo="No pudimos verificar tu correo">
        <MensajeFormulario tipo="error">{mensaje}</MensajeFormulario>
        <div className="w-full">
          <ReenviarVerificacion />
        </div>
      </PantallaEstado>
    )
  }

  if (!verificado) {
    return (
      <p role="status" className="flex flex-col items-center gap-3 py-6 text-center text-muted-foreground">
        <LoaderCircle aria-hidden="true" className="size-8 animate-spin text-primary motion-reduce:animate-none" />
        Verificando tu correo...
      </p>
    )
  }

  return (
    <PantallaEstado icono={BadgeCheck} tono="exito" titulo="Correo verificado">
      <p className="text-muted-foreground">Tu cuenta quedó lista. Ya puedes iniciar sesión.</p>
      <Button asChild>
        <Link to={RUTAS.iniciarSesion}>Ir a iniciar sesión</Link>
      </Button>
    </PantallaEstado>
  )
}
