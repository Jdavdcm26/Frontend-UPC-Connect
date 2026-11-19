import { Compass, FileText, Languages, Sparkles, Wrench, Zap, type LucideIcon } from 'lucide-react'
import { cn } from 'cn'
import NivelHabilidadBar from '@/features/perfil/NivelHabilidadBar'
import ProfileSection from '@/features/perfil/ProfileSection'
import type { HabilidadPerfil, TipoHabilidad } from '@/features/perfil/tipos'

type Props = {
  descripcion?: string
  intereses?: string[]
  habilidades?: HabilidadPerfil[]
}

const GRUPOS: { tipo: TipoHabilidad; titulo: string; icono: LucideIcon }[] = [
  { tipo: 'IDIOMA', titulo: 'Idiomas', icono: Languages },
  { tipo: 'TECNICA', titulo: 'Habilidades técnicas', icono: Wrench },
  { tipo: 'BLANDA', titulo: 'Habilidades blandas', icono: Sparkles },
]

// Secciones de lectura de un perfil: solo se pinta la que tiene contenido.
// La usan «Mi perfil» (FE-16) y el perfil de otra persona (FE-26). La ciudad va en el encabezado.
export default function ProfileDetails({ descripcion, intereses = [], habilidades = [] }: Props) {
  const hayPrincipal = Boolean(descripcion) || habilidades.length > 0
  const hayIntereses = intereses.length > 0
  if (!hayPrincipal && !hayIntereses) return null

  return (
    <div className={cn('grid gap-6', hayPrincipal && hayIntereses && 'lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start')}>
      {hayPrincipal && (
        <div className="space-y-6">
          {descripcion && (
            <ProfileSection titulo="Acerca de mí" icono={FileText}>
              <div className="relative rounded-xl border border-primary/10 bg-linear-to-br from-primary/5 to-transparent p-4 sm:p-5">
                <span aria-hidden="true" className="absolute -top-3 left-4 bg-card px-1 font-heading text-4xl leading-none text-primary/25">
                  “
                </span>
                <p className="whitespace-pre-line break-words text-sm leading-7 text-foreground/80 sm:text-[15px]">{descripcion}</p>
              </div>
            </ProfileSection>
          )}

          {habilidades.length > 0 && (
            <ProfileSection titulo="Habilidades" icono={Zap}>
              <div className="space-y-5">
                {GRUPOS.map(({ tipo, titulo, icono: Icono }) => {
                  const delGrupo = habilidades.filter((habilidad) => habilidad.tipo === tipo)
                  if (delGrupo.length === 0) return null
                  return (
                    <div key={tipo} className="space-y-3">
                      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        <Icono aria-hidden="true" className="size-3.5 text-primary" />
                        {titulo}
                      </p>
                      <div className="grid gap-2.5 sm:grid-cols-2">
                        {delGrupo.map((habilidad) => (
                          <NivelHabilidadBar key={habilidad.id} habilidad={habilidad} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </ProfileSection>
          )}
        </div>
      )}

      {hayIntereses && (
        <ProfileSection titulo="Intereses" icono={Compass}>
          <ul className="flex flex-wrap gap-2">
            {intereses.map((interes) => (
              <li
                key={interes}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary sm:text-sm"
              >
                <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                {interes}
              </li>
            ))}
          </ul>
        </ProfileSection>
      )}
    </div>
  )
}
