import ApplicationCard from '@/features/postulaciones/ApplicationCard'
import type { Postulacion } from '@/features/postulaciones/tipos'

// Lista de tarjetas de postulaciones (FE-24).
export default function ApplicationList({ postulaciones }: { postulaciones: Postulacion[] }) {
  return (
    <ul className="space-y-3">
      {postulaciones.map((postulacion) => (
        <li key={postulacion.id}>
          <ApplicationCard postulacion={postulacion} />
        </li>
      ))}
    </ul>
  )
}