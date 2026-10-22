import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RUTAS } from '@/shared/lib/rutas'

const FOCO = 'outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary'

// Cierre de la página de inicio: invita a crear la cuenta. Va sobre fondo verde, con texto blanco.
export default function LlamadoFinal() {
  return (
    <section
      aria-labelledby="titulo-llamado"
      className="rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-12 sm:py-14"
    >
      <div className="max-w-2xl space-y-4">
        <h2 id="titulo-llamado" className="text-3xl font-bold">
          Crea tu cuenta y postúlate hoy
        </h2>
        <p className="text-primary-foreground/90">
          Regístrate con el correo institucional de tu universidad y verifica tu correo para activar tu cuenta.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to={RUTAS.registro}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-background px-6 text-base font-medium text-primary transition-colors hover:bg-primary-soft ${FOCO}`}
          >
            Crear cuenta
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <Link
            to={RUTAS.iniciarSesion}
            className={`inline-flex h-11 items-center justify-center rounded-lg border border-white/60 px-6 text-base font-medium text-white transition-colors hover:bg-white/10 ${FOCO}`}
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </section>
  )
}
