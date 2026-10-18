import { Badge } from '@/components/ui/badge'
import { ETIQUETA_ESTADO_POSTULACION, type EstadoPostulacion } from '@/features/postulaciones/tipos'

const VARIANTE: Record<EstadoPostulacion, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  RECIBIDA: 'secondary',
  EN_REVISION: 'outline',
  ENTREVISTA: 'default',
  SELECCIONADO: 'default',
  NO_SELECCIONADO: 'destructive',
}

// Etiqueta con el estado de una postulación (HU-46). El texto siempre dice el estado, no solo el color.
export default function ApplicationStateBadge({ estado }: { estado: EstadoPostulacion }) {
  return <Badge variant={VARIANTE[estado]}>{ETIQUETA_ESTADO_POSTULACION[estado]}</Badge>
}