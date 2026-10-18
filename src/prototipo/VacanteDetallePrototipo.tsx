import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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
import { vacantes } from '@/prototipo/datosPrototipo'
import EmptyState from '@/shared/ui/EmptyState'

// Prototipo de baja fidelidad (FE-08): detalle de la vacante y postulación.
export default function VacanteDetallePrototipo() {
  const { id } = useParams()
  const [postulado, setPostulado] = useState(false)
  const vacante = vacantes.find((v) => v.id === id)

  if (!vacante) {
    return <EmptyState titulo="Vacante no encontrada" descripcion="Esta vacante no existe." />
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Link to="/prototipo/vacantes" className="text-primary underline">
        ← Volver a vacantes
      </Link>
      <h1 className="text-2xl font-bold">{vacante.titulo}</h1>
      <p className="text-sm text-muted-foreground">
        {vacante.empresa} · {vacante.ciudad} · {vacante.modalidad}
      </p>
      <p>{vacante.descripcion}</p>

      {postulado ? (
        <Button disabled>Postulado</Button>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>Postularme</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Postularte a esta vacante?</AlertDialogTitle>
              <AlertDialogDescription>
                La empresa verá tu perfil. No podrás repetir la postulación.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => setPostulado(true)}>Confirmar</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}