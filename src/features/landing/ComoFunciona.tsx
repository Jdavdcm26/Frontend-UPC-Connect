import { Activity, Search, UserPlus, type LucideIcon } from 'lucide-react'

type Paso = { icono: LucideIcon; titulo: string; texto: string }

const PASOS: Paso[] = [
  {
    icono: UserPlus,
    titulo: 'Crea tu cuenta y completa tu perfil',
    texto: 'Regístrate con tu correo institucional (@unicesar.edu.co), verifícalo e ingresa tu programa académico, semestre o año de graduación.',
  },
  {
    icono: Search,
    titulo: 'Explora ofertas y postúlate',
    texto: 'Filtra vacantes por modalidad, carrera y ubicación. Revisa los requerimientos y envía tu postulación junto con un mensaje de interés.',
  },
  {
    icono: Activity,
    titulo: 'Sigue cada fase del proceso',
    texto: 'Supervisa el progreso desde tu panel personal: confirmación de recepción, revisión técnica, citación a entrevista y selección final.',
  },
]

// Los tres pasos para usar la plataforma, en una lista numerada moderna.
export default function ComoFunciona() {
  return (
    <section aria-labelledby="titulo-como-funciona" className="space-y-10">
      <div className="max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Paso a paso
        </div>
        <h2 id="titulo-como-funciona" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Cómo funciona en 3 sencillos pasos
        </h2>
        <p className="text-muted-foreground sm:text-lg">
          Un proceso ágil y transparente desde tu registro hasta la vinculación con empresas.
        </p>
      </div>

      <ol className="grid gap-6 md:grid-cols-3">
        {PASOS.map(({ icono: Icono, titulo, texto }, i) => (
          <li
            key={titulo}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-6 shadow-sm backdrop-blur-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md sm:p-7 motion-reduce:transform-none"
          >
            {/* Número watermark en el fondo */}
            <span
              aria-hidden="true"
              className="absolute -top-3 -right-1 font-mono text-6xl font-black text-foreground/[0.04] dark:text-foreground/[0.06] select-none pointer-events-none transition-colors group-hover:text-primary/10"
            >
              0{i + 1}
            </span>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-xl bg-linear-to-br from-primary to-emerald-700 text-white shadow-xs shadow-primary/25 transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none">
                  <Icono aria-hidden="true" className="size-5.5" />
                </span>
                <span className="rounded-full border border-border/80 bg-muted/60 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                  Fase 0{i + 1}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-foreground">{titulo}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">{texto}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50">
              <span className="text-[11px] font-semibold text-primary uppercase tracking-wider">
                {i === 0 ? 'Punto de partida' : i === 1 ? 'Conexión' : 'Resultado'}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
