import VacancyCard from '@/features/vacantes/VacancyCard'
import type { Vacante } from '@/features/vacantes/tipos'

// Lista de tarjetas de vacantes (FE-21).
export default function VacancyList({ vacantes }: { vacantes: Vacante[] }) {
  return (
    <ul className="space-y-4">
      {vacantes.map((vacante) => (
        <li key={vacante.id}>
          <VacancyCard vacante={vacante} />
        </li>
      ))}
    </ul>
  )
}
