import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type Props = {
  abierto: boolean
  onAbiertoChange: (abierto: boolean) => void
  titulo: string
  descripcion: string
  etiquetaConfirmar?: string
  onConfirmar: () => void
}

// Ventana que pide confirmar una acción antes de hacerla. Se abre y cierra desde fuera,
// así se puede abrir desde cualquier botón (por ejemplo, tras elegir una opción).
export default function ConfirmDialog({
  abierto,
  onAbiertoChange,
  titulo,
  descripcion,
  etiquetaConfirmar = 'Confirmar',
  onConfirmar,
}: Props) {
  return (
    <AlertDialog open={abierto} onOpenChange={onAbiertoChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{titulo}</AlertDialogTitle>
          <AlertDialogDescription>{descripcion}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmar}>{etiquetaConfirmar}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}