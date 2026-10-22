import { Activity, Search, UserPlus, type LucideIcon } from 'lucide-react'

type Paso = { icono: LucideIcon; titulo: string; texto: string }

const PASOS: Paso[] = [
  {
    icono: UserPlus,
    titulo: 'Crea tu cuenta y tu perfil',
    texto: 'Regístrate con tu correo institucional, verifica tu correo y completa tu carrera, semestre o año de grado.',
  },
  {
    icono: Search,
    titulo: 'Encuentra y postúlate',
    texto: 'Filtra las ofertas, abre el detalle de la vacante y envía tu postulación con un mensaje.',
  },
  {
    icono: Activity,
    titulo: 'Haz seguimiento',
    texto: 'En «Mis postulaciones» ves si cada una fue recibida, está en revisión, tiene entrevista o fue seleccionada.',
  },
]

// Los tres pasos para usar la plataforma, en una lista numerada.
export default function ComoFunciona() {
  return (
    <section aria-labelledby="titulo-como-funciona" className="space-y-8">
      <div className="max-w-2xl space-y-2">
        <h2 id="titulo-como-funciona" className="text-3xl font-bold">
          Cómo funciona en 3 pasos
        </h2>
        <p className="text-muted-foreground">
          Un proceso sencillo para pasar de crear tu perfil a saber cómo va tu postulación.
        </p>
      </div>
      <ol className="grid gap-6 md:grid-cols-3">
        {PASOS.map(({ icono: Icono, titulo, texto }, i) => (
          <li key={titulo} className="space-y-4 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
                Paso {i + 1}
              </span>
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icono aria-hidden="true" className="size-5" />
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold">{titulo}</h3>
              <p className="text-sm text-muted-foreground">{texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
