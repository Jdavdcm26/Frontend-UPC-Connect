import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import VacancyStateBadge from '@/features/vacantes/VacancyStateBadge'
import type { Vacante } from '@/features/vacantes/tipos'
import { rutaPostulacionesVacante } from '@/shared/lib/rutas'

// Resumen de las vacantes de la empresa: estado, postulaciones recibidas y acceso a los candidatos (FE-29).
export default function VacancySummaryTable({ vacantes }: { vacantes: Vacante[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Vacante</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Postulaciones</TableHead>
          <TableHead>
            <span className="sr-only">Acciones</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vacantes.map((vacante) => (
          <TableRow key={vacante.id}>
            <TableCell className="whitespace-normal break-words font-medium">{vacante.titulo}</TableCell>
            <TableCell>
              <VacancyStateBadge estado={vacante.estado} />
            </TableCell>
            {/* Si el servidor aún no envía el conteo (llega con BE-32), se cuenta como 0. */}
            <TableCell className="text-right">{vacante.postulacionesTotal ?? 0}</TableCell>
            <TableCell className="text-right">
              <Button asChild variant="outline" size="sm">
                <Link to={rutaPostulacionesVacante(vacante.id)} aria-label={`Ver candidatos de ${vacante.titulo}`}>
                  Ver candidatos
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
