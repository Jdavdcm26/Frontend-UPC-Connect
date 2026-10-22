import { Compass, FileText, Zap } from 'lucide-react'
import { etiquetaNivel } from '@/features/perfil/formato'
import ProfileSection from '@/features/perfil/ProfileSection'
import type { HabilidadPerfil } from '@/features/perfil/tipos'
import { cn } from 'cn'

type Props = {
  descripcion?: string
  intereses?: string[]
  habilidades?: HabilidadPerfil[]
}

// Secciones de lectura de un perfil: solo se pinta la que tiene contenido.
// La usan «Mi perfil» (FE-16) y el perfil de otra persona (FE-26). La ciudad va en el encabezado.
export default function ProfileDetails({ descripcion, intereses = [], habilidades = [] }: Props) {
  const hayPrincipal = Boolean(descripcion) || habilidades.length > 0
  const hayIntereses = intereses.length > 0
  if (!hayPrincipal && !hayIntereses) return null

  return (
    // Con intereses, van en una columna a la derecha (en pantallas anchas); sin ellos, lo demás ocupa todo el ancho.
    <div className={cn('grid gap-6', hayPrincipal && hayIntereses && 'lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start')}>
      {hayPrincipal && (
        <div className="space-y-6">
          {descripcion && (
            <ProfileSection titulo="Acerca de mí" icono={FileText}>
              <p className="whitespace-pre-line break-words leading-relaxed text-muted-foreground">{descripcion}</p>
            </ProfileSection>
          )}

          {habilidades.length > 0 && (
            <ProfileSection titulo="Habilidades" icono={Zap}>
              <ul className="flex flex-wrap gap-2">
                {habilidades.map((habilidad) => (
                  <li
                    key={habilidad.id}
                    className="inline-flex items-center gap-2 rounded-lg border bg-background px-3 py-1.5 text-sm font-medium"
                  >
                    {habilidad.nombre}
                    {habilidad.nivel && (
                      <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-semibold text-primary">
                        {etiquetaNivel(habilidad.nivel)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </ProfileSection>
          )}
        </div>
      )}

      {hayIntereses && (
        <ProfileSection titulo="Intereses" icono={Compass}>
          <ul className="flex flex-wrap gap-2">
            {intereses.map((interes) => (
              <li key={interes} className="rounded-full bg-tint-strong px-3 py-1 text-sm font-medium break-words">
                {interes}
              </li>
            ))}
          </ul>
        </ProfileSection>
      )}
    </div>
  )
}
