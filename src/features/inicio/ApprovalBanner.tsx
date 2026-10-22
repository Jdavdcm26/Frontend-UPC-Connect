import { Clock } from 'lucide-react'
import AvisoInformativo from '@/shared/ui/AvisoInformativo'

// Aviso para la empresa que todavía no fue aprobada: puede entrar, pero no publicar (RF-42).
export default function ApprovalBanner() {
  return (
    <AvisoInformativo icono={Clock}>
      <span className="block font-semibold">Tu empresa aún no ha sido aprobada</span>
      <span className="block font-normal">
        Mientras la administración de la UPC la revisa, todavía no puedes publicar vacantes.
      </span>
    </AvisoInformativo>
  )
}
