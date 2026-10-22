import { Check, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ApplyDialog from '@/features/postulaciones/ApplyDialog'
import type { Vacante } from '@/features/vacantes/tipos'

type Props = {
  vacante: Vacante
  // Se llama al terminar el envío de la postulación, con éxito o con error.
  onPostulado: () => void
}

// Muestra la acción de postularse según la vacante (HU-45 / FE-23).
// Para llegar al detalle ya se exige tener el perfil completo (RequirePerfil), así que no se revisa aquí.
export default function ApplyButton({ vacante, onPostulado }: Props) {
  if (vacante.yaPostulado) {
    return (
      <Button size="lg" className="w-full" disabled>
        <Check aria-hidden="true" />
        Postulado
      </Button>
    )
  }

  // El motivo ya aparece en el aviso de la página; aquí solo se deshabilita la acción.
  // «abierta» la decide el servidor: también cubre la vacante activa con la fecha de cierre vencida.
  if (!vacante.abierta) {
    return (
      <Button size="lg" className="w-full" disabled>
        <Send aria-hidden="true" />
        Postularme
      </Button>
    )
  }

  return <ApplyDialog vacanteId={vacante.id} vacanteTitulo={vacante.titulo} onPostulado={onPostulado} />
}
