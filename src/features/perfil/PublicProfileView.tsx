import { resumenAcademico } from '@/features/perfil/formato'
import ProfileDetails from '@/features/perfil/ProfileDetails'
import ProfileHeader from '@/features/perfil/ProfileHeader'
import type { PerfilPublico } from '@/features/perfil/tipos'

// Perfil de otra persona en modo lectura (HU-27 / FE-26).
// No hay botón de editar y las secciones sin contenido no se pintan.
export default function PublicProfileView({ perfil }: { perfil: PerfilPublico }) {
  const detalle = resumenAcademico({
    carrera: perfil.carreraNombre,
    semestre: perfil.semestre,
    anioGrado: perfil.anioGrado,
  })

  return (
    <article className="space-y-6">
      <ProfileHeader
        nombres={perfil.nombres}
        apellidos={perfil.apellidos}
        titular={perfil.titular}
        detalle={detalle}
        ciudad={perfil.ciudad}
        soloLectura
      />
      <ProfileDetails
        descripcion={perfil.descripcion}
        intereses={perfil.intereses}
        habilidades={perfil.habilidades}
      />
    </article>
  )
}
