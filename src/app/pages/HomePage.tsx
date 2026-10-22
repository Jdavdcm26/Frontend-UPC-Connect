import Beneficios from '@/features/landing/Beneficios'
import ComoFunciona from '@/features/landing/ComoFunciona'
import LlamadoFinal from '@/features/landing/LlamadoFinal'
import Portada from '@/features/landing/Portada'

// Página de inicio (pública): portada, beneficios, cómo funciona y llamado a crear la cuenta.
export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24">
      <Portada />
      <Beneficios />
      <ComoFunciona />
      <LlamadoFinal />
    </div>
  )
}
