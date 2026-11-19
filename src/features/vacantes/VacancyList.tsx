import VacancyCard from '@/features/vacantes/VacancyCard'
import type { Vacante } from '@/features/vacantes/tipos'

// Lista de tarjetas de vacantes (FE-21).
export default function VacancyList({ vacantes }: { vacantes: Vacante[] }) {
  return (
    <ul className="space-y-4">
      {vacantes.map((vacante, indice) => (
        <li key={vacante.id} className="entrar" style={{ animationDelay: `${Math.min(indice, 6) * 55}ms` }}>
          <VacancyCard vacante={vacante} />
        </li>
      ))}
    </ul>
  )
}
