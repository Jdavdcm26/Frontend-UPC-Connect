import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import SeguimientoEjemplo from '@/features/landing/SeguimientoEjemplo'
import { RUTAS } from '@/shared/lib/rutas'

// Portada de la página de inicio: propuesta de valor y las dos acciones principales.
export default function Portada() {
  return (
    <section className="relative grid items-center gap-12 py-6 sm:py-12 lg:grid-cols-12 lg:gap-8">
      <div className="space-y-6 lg:col-span-7">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-xs backdrop-blur-xs">
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
          <span className="inline-flex items-center gap-1">
            Red profesional oficial de la Universidad Popular del Cesar
            <Sparkles className="size-3 text-primary/80" aria-hidden="true" />
          </span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-[3.35rem] lg:leading-[1.12]">
          El puente entre el{' '}
          <span className="bg-linear-to-r from-primary via-emerald-600 to-teal-700 bg-clip-text text-transparent">
            talento upecista
          </span>{' '}
          y el futuro profesional
        </h1>

        <p className="max-w-xl text-base text-muted-foreground sm:text-lg sm:leading-relaxed">
          Encuentra prácticas, pasantías y vacantes laborales validadas. Conéctate con empresas aliadas,
          destaca tus habilidades y gestiona tu trayectoria desde una sola plataforma.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button asChild size="lg" className="gap-2 font-semibold shadow-sm shadow-primary/25 transition-transform hover:-translate-y-0.5 motion-reduce:transform-none">
            <Link to={RUTAS.registro}>
              Crear cuenta institucional
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-border/80 bg-card/60 font-semibold backdrop-blur-xs transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
          >
            <Link to={RUTAS.iniciarSesion}>Iniciar sesión</Link>
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-4 text-primary" aria-hidden="true" />
            Exclusivo con correo institucional
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
            Empresas y vacantes autorizadas
          </span>
        </div>
      </div>

      <div className="lg:col-span-5">
        <SeguimientoEjemplo />
      </div>
    </section>
  )
}
