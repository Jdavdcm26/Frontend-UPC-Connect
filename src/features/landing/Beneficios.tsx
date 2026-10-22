import {
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
import { RUTAS } from '@/shared/lib/rutas'
import { claseEnlace } from '@/shared/ui/estilosEnlace'

type Beneficio = { icono: LucideIcon; titulo: string; texto: string }

const PARA_CANDIDATOS: Beneficio[] = [
  {
    icono: Briefcase,
    titulo: 'Prácticas, pasantías y vacantes',
    texto: 'Todas las ofertas en un mismo lugar, con filtros por carrera, tipo, modalidad y ciudad.',
  },
  {
    icono: Send,
    titulo: 'Postulación con tu mensaje',
    texto: 'Envía tu postulación con un mensaje para la empresa y revisa a cuáles ya te postulaste.',
  },
  {
    icono: ListChecks,
    titulo: 'Seguimiento del estado',
    texto: 'Consulta si tu postulación fue recibida, está en revisión, tiene entrevista o fue seleccionada.',
  },
  {
    icono: UserRound,
    titulo: 'Perfil con tus habilidades',
    texto: 'Muestra tu carrera, tu semestre o año de grado y tus habilidades a las empresas.',
  },
]

const PARA_EMPRESAS: Beneficio[] = [
  {
    icono: ShieldCheck,
    titulo: 'Cuentas dadas de alta por la UPC',
    texto: 'Las empresas no se registran solas: la UPC da de alta cada cuenta.',
  },
  {
    icono: FilePlus2,
    titulo: 'Publica y administra vacantes',
    texto: 'Crea ofertas, edítalas, páusalas o ciérralas cuando quieras.',
  },
  {
    icono: Users,
    titulo: 'Revisa las postulaciones',
    texto: 'Mira quién se postuló y abre el perfil completo de cada candidato.',
  },
  {
    icono: RefreshCw,
    titulo: 'Mantén informados a los candidatos',
    texto: 'Cambia el estado de cada postulación para que cada persona sepa en qué va.',
  },
]

function Lista({ beneficios }: { beneficios: Beneficio[] }) {
  return (
    <ul className="space-y-4">
      {beneficios.map(({ icono: Icono, titulo, texto }) => (
        <li key={titulo} className="flex gap-3">
          <Icono aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <p className="font-medium">{titulo}</p>
            <p className="text-sm text-muted-foreground">{texto}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

// Qué gana cada tipo de cuenta. Solo se cuenta lo que la aplicación hace hoy.
export default function Beneficios() {
  return (
    <section aria-labelledby="titulo-beneficios" className="space-y-8">
      <div className="max-w-2xl space-y-2">
        <h2 id="titulo-beneficios" className="text-3xl font-bold">
          Pensada para quienes buscan y para quienes contratan
        </h2>
        <p className="text-muted-foreground">
          Una sola plataforma para estudiantes, egresados y las empresas que la UPC da de alta.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <article className="flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm">
          <header className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <GraduationCap aria-hidden="true" className="size-6" />
            </span>
            <h3 className="text-xl font-semibold">Para estudiantes y egresados</h3>
          </header>
          <Lista beneficios={PARA_CANDIDATOS} />
          <Link to={RUTAS.registro} className={`${claseEnlace} mt-auto w-fit`}>
            Crear cuenta de estudiante o egresado
          </Link>
        </article>
        <article className="flex flex-col gap-6 rounded-xl border bg-card p-6 shadow-sm">
          <header className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-tint-strong text-primary">
              <Building2 aria-hidden="true" className="size-6" />
            </span>
            <h3 className="text-xl font-semibold">Para empresas</h3>
          </header>
          <Lista beneficios={PARA_EMPRESAS} />
          <p className="mt-auto text-sm text-muted-foreground">
            Si tu empresa aún no tiene cuenta, la UPC debe darla de alta.
          </p>
        </article>
      </div>
    </section>
  )
}
