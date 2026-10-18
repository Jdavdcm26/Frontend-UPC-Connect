import { Badge } from '@/components/ui/badge'
import { ETIQUETA_ESTADO, type EstadoVacante } from '@/features/vacantes/tipos'

const VARIANTE: Record<EstadoVacante, 'default' | 'secondary' | 'outline'> = {
  ACTIVA: 'default',
  PAUSADA: 'secondary',
  CERRADA: 'outline',
}

// Etiqueta con el estado de una vacante.
export default function VacancyStateBadge({ estado }: { estado: EstadoVacante }) {
  return <Badge variant={VARIANTE[estado]}>{ETIQUETA_ESTADO[estado]}</Badge>
}