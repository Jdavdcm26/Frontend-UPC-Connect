import {
  ArrowRight,
  Building2,
  FilePlus2,
  GraduationCap,
  ListChecks,
  RefreshCw,
  Send,
  ShieldCheck,
  Briefcase,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { RUTAS } from '@/shared/lib/rutas'

type Beneficio = { icono: LucideIcon; titulo: string; texto: string }

const PARA_CANDIDATOS: Beneficio[] = [
  {
    icono: Briefcase,
    titulo: 'Prácticas, pasantías y vacantes',
    texto: 'Ofertas validadas con filtros por carrera, modalidad, tipo y ciudad.',
  },
  {
    icono: Send,
    titulo: 'Postulación ágil con mensaje',
    texto: 'Envía tu postulación con un mensaje personalizado y revisa tu historial.',
  },
  {
    icono: ListChecks,
    titulo: 'Seguimiento transparente',
    texto: 'Conoce en tiempo real si tu postulación está en revisión, entrevista o seleccionada.',
  },
  {
    icono: UserRound,
    titulo: 'Perfil profesional académico',
    texto: 'Muestra tu carrera, semestre, año de grado y competencias destacadas.',
  },
]

const PARA_EMPRESAS: Beneficio[] = [
  {
    icono: ShieldCheck,
    titulo: 'Cuentas validadas por la UPC',
    texto: 'Red segura y confiable: la universidad da de alta a cada empresa aliada.',
  },
  {
    icono: FilePlus2,
    titulo: 'Publica y gestiona vacantes',
    texto: 'Crea ofertas dirigidas a carreras específicas, edítalas o ciérralas fácilmente.',
  },
  {
    icono: Users,
    titulo: 'Acceso al mejor talento joven',
    texto: 'Evalúa perfiles completos de postulantes de manera ordenada y centralizada.',
  },
  {
    icono: RefreshCw,
    titulo: 'Feedback directo a postulantes',
    texto: 'Actualiza los estados para una comunicación transparente y profesional.',
  },
]

function Lista({ beneficios, colorClase }: { beneficios: Beneficio[]; colorClase: string }) {
  return (
    <ul className="space-y-4">
      {beneficios.map(({ icono: Icono, titulo, texto }) => (
        <li key={titulo} className="group/item flex items-start gap-3.5">
          <span
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${colorClase}`}
          >
            <Icono aria-hidden="true" className="size-4.5" />
          </span>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground">{titulo}</p>
            <p className="text-xs leading-relaxed text-muted-foreground">{texto}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

// Qué gana cada tipo de cuenta.
export default function Beneficios() {
  return (
    <section aria-labelledby="titulo-beneficios" className="space-y-10">
      <div className="max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Ventajas y características
        </div>
        <h2 id="titulo-beneficios" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Diseñada para conectar el talento con las empresas
        </h2>
        <p className="text-muted-foreground sm:text-lg">
          Una plataforma oficial y estructurada para estudiantes, graduados y organizaciones aliadas.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Tarjeta Candidatos */}
        <article className="relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-6 shadow-sm backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:p-8 motion-reduce:transform-none before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-linear-to-r before:from-primary before:to-emerald-500">
          <header className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <GraduationCap aria-hidden="true" className="size-6" />
              </span>
              <div>
                <h3 className="text-xl font-bold">Estudiantes y egresados</h3>
                <p className="text-xs text-muted-foreground">Oportunidades para impulsar tu carrera</p>
              </div>
            </div>
            <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              Candidatos
            </span>
          </header>

          <Lista
            beneficios={PARA_CANDIDATOS}
            colorClase="bg-primary/10 text-primary border-primary/20 group-hover/item:bg-primary group-hover/item:text-white group-hover/item:border-primary"
          />

          <div className="mt-auto pt-4 border-t border-border/60">
            <Button asChild className="w-full sm:w-auto gap-2 font-medium shadow-xs">
              <Link to={RUTAS.registro}>
                Crear cuenta de estudiante
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>
        </article>

        {/* Tarjeta Empresas */}
        <article className="relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-6 shadow-sm backdrop-blur-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-500/40 hover:shadow-md sm:p-8 motion-reduce:transform-none before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-linear-to-r before:from-teal-600 before:to-emerald-500">
          <header className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
                <Building2 aria-hidden="true" className="size-6" />
              </span>
              <div>
                <h3 className="text-xl font-bold">Empresas y organizaciones</h3>
                <p className="text-xs text-muted-foreground">Acceso al potencial formativo upecista</p>
              </div>
            </div>
            <span className="rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
              Aliados
            </span>
          </header>

          <Lista
            beneficios={PARA_EMPRESAS}
            colorClase="bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20 group-hover/item:bg-teal-600 group-hover/item:text-white group-hover/item:border-teal-600"
          />

          <div className="mt-auto pt-4 border-t border-border/60">
            <div className="rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Proceso institucional: </span>
              Las empresas son validadas y habilitadas directamente por el área encargada de la UPC para garantizar procesos transparentes.
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
