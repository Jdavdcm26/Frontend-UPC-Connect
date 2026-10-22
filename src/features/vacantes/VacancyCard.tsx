import { Link } from 'react-router-dom'
import { ETIQUETA_MODALIDAD, type Vacante } from '@/features/vacantes/tipos'
import VacancyTypeBadge from '@/features/vacantes/VacancyTypeBadge'
import { RUTAS } from '@/shared/lib/rutas'

// Tarjeta de una vacante en el listado (FE-21). El título lleva al detalle (FE-22).
export default function VacancyCard({ vacante }: { vacante: Vacante }) {
  return (
    <article className="space-y-2 rounded-lg border p-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="font-semibold">
          <Link to={`${RUTAS.vacantes}/${vacante.id}`} className="hover:underline">
            {vacante.titulo}
          </Link>
        </h2>
        <VacancyTypeBadge tipo={vacante.tipo} />
      </div>
      <p className="text-sm">{vacante.empresa}</p>
      <p className="text-sm text-muted-foreground">
        {ETIQUETA_MODALIDAD[vacante.modalidad]} · {vacante.ciudad}
      </p>
      <p className="text-sm text-muted-foreground">Cierra el {vacante.fechaCierre}</p>
    </article>
  )
}