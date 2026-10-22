import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import SeguimientoEjemplo from '@/features/landing/SeguimientoEjemplo'
import { RUTAS } from '@/shared/lib/rutas'

// Portada de la página de inicio: propuesta de valor y las dos acciones principales.
export default function Portada() {
  return (
    <section className="grid items-center gap-12 py-4 sm:py-8 lg:grid-cols-2">
      <div className="space-y-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
          Red profesional de la Universidad Popular del Cesar
        </p>
        <h1 className="text-4xl leading-[1.1] font-bold sm:text-5xl">
          El puente entre el <span className="text-primary">talento upecista</span> y las oportunidades laborales
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Encuentra prácticas, pasantías y vacantes, postúlate desde un solo lugar y sigue el estado de cada
          postulación.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to={RUTAS.registro}>
              Crear cuenta
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to={RUTAS.iniciarSesion}>Iniciar sesión</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Para estudiantes y egresados con correo institucional.</p>
      </div>
      <SeguimientoEjemplo />
    </section>
  )
}
