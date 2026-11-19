import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { RUTAS } from '@/shared/lib/rutas'

const FOCO =
  'outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary'

// Cierre de la página de inicio: invita a crear la cuenta con un diseño inmersivo y moderno.
export default function LlamadoFinal() {
  return (
    <section
      aria-labelledby="titulo-llamado"
      className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#00522b] via-[#006837] to-[#01381d] px-6 py-12 text-white shadow-xl shadow-primary/15 sm:px-12 sm:py-16 lg:px-16"
    >
      {/* Círculos decorativos ambientales */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 size-80 rounded-full bg-teal-400/15 blur-3xl"
      />

      <div className="relative max-w-2xl space-y-5">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-semibold text-white/95 backdrop-blur-xs">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Comienza tu trayectoria profesional hoy
        </div>

        <h2 id="titulo-llamado" className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          Tu próximo paso profesional empieza en UPC Connect
        </h2>

        <p className="text-base text-white/90 sm:text-lg sm:leading-relaxed">
          Regístrate con tu correo institucional (@unicesar.edu.co), verifica tu acceso y postúlate a las mejores
          prácticas y vacantes de empresas aliadas.
        </p>

        <div className="flex flex-wrap items-center gap-3.5 pt-3">
          <Link
            to={RUTAS.registro}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-bold text-primary shadow-sm shadow-black/10 transition-all hover:bg-emerald-50 hover:shadow-md hover:-translate-y-0.5 motion-reduce:transform-none ${FOCO}`}
          >
            Crear cuenta institucional
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <Link
            to={RUTAS.iniciarSesion}
            className={`inline-flex h-11 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-xs transition-all hover:bg-white/20 hover:-translate-y-0.5 motion-reduce:transform-none ${FOCO}`}
          >
            Ya tengo cuenta
          </Link>
        </div>
      </div>
    </section>
  )
}
