import { Link } from 'react-router-dom'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { EstadoVacante, Vacante } from '@/features/vacantes/tipos'
import { rutaEditarVacante, rutaPostulacionesVacante } from '@/shared/lib/rutas'

type Props = {
  vacante: Vacante
  ocupado: boolean
  onCambiarEstado: (estado: EstadoVacante) => void
}

type ConfirmarProps = {
  etiqueta: string
  titulo: string
  descripcion: string
  deshabilitado: boolean
  onConfirmar: () => void
}

// Botón que pide confirmación antes de ejecutar la acción.
function ConfirmarAccion({ etiqueta, titulo, descripcion, deshabilitado, onConfirmar }: ConfirmarProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={deshabilitado}>
          {etiqueta}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titulo}</AlertDialogTitle>
          <AlertDialogDescription>{descripcion}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmar}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Acciones de una vacante de la empresa según su estado (FE-20 y FE-25).
// Una vacante cerrada ya no se edita, pero sus postulaciones se pueden seguir viendo.
export default function VacancyActions({ vacante, ocupado, onCambiarEstado }: Props) {
  const cerrada = vacante.estado === 'CERRADA'

  return (
    <div className="flex flex-wrap gap-2">
      <Button asChild variant="outline" size="sm">
        <Link to={rutaPostulacionesVacante(vacante.id)}>Ver postulaciones</Link>
      </Button>
      {!cerrada && (
        <Button asChild variant="outline" size="sm">
          <Link to={rutaEditarVacante(vacante.id)}>Editar</Link>
        </Button>
      )}
      {vacante.estado === 'ACTIVA' && (
        <ConfirmarAccion
          etiqueta="Pausar"
          titulo="¿Pausar esta vacante?"
          descripcion="Dejará de mostrarse a los candidatos hasta que la reanudes."
          deshabilitado={ocupado}
          onConfirmar={() => onCambiarEstado('PAUSADA')}
        />
      )}
      {vacante.estado === 'PAUSADA' && (
        <Button variant="outline" size="sm" disabled={ocupado} onClick={() => onCambiarEstado('ACTIVA')}>
          Reanudar
        </Button>
      )}
      {!cerrada && (
        <ConfirmarAccion
          etiqueta="Cerrar"
          titulo="¿Cerrar esta vacante?"
          descripcion="Una vacante cerrada ya no se puede reabrir."
          deshabilitado={ocupado}
          onConfirmar={() => onCambiarEstado('CERRADA')}
        />
      )}
    </div>
  )
}