import { etiquetaNivel } from '@/features/perfil/formato'
import ProfileSection from '@/features/perfil/ProfileSection'
import type { HabilidadPerfil } from '@/features/perfil/tipos'

type Props = {
  descripcion?: string
  ciudad?: string
  intereses?: string[]
  habilidades?: HabilidadPerfil[]
}

// Secciones de lectura de un perfil: solo se pinta la que tiene contenido.
// La usan «Mi perfil» (FE-16) y el perfil de otra persona (FE-26).
export default function ProfileDetails({ descripcion, ciudad, intereses = [], habilidades = [] }: Props) {
  return (
    <>
      {descripcion && (
        <ProfileSection titulo="Acerca de mí">
          <p className="whitespace-pre-line text-muted-foreground">{descripcion}</p>
        </ProfileSection>
      )}

      {ciudad && (
        <ProfileSection titulo="Ciudad">
          <p className="text-muted-foreground">{ciudad}</p>
        </ProfileSection>
      )}

      {habilidades.length > 0 && (
        <ProfileSection titulo="Habilidades">
          <ul className="flex flex-wrap gap-2">
            {habilidades.map((habilidad) => (
              <li key={habilidad.id} className="rounded-full border px-3 py-1 text-sm">
                {habilidad.nombre}
                {habilidad.nivel && (
                  <span className="text-muted-foreground"> · {etiquetaNivel(habilidad.nivel)}</span>
                )}
              </li>
            ))}
          </ul>
        </ProfileSection>
      )}

      {intereses.length > 0 && (
        <ProfileSection titulo="Intereses">
          <ul className="flex flex-wrap gap-2">
            {intereses.map((interes) => (
              <li key={interes} className="rounded-full border px-3 py-1 text-sm">
                {interes}
              </li>
            ))}
          </ul>
        </ProfileSection>
      )}
    </>
  )
}
