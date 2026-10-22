import Beneficios from '@/features/landing/Beneficios'
import ComoFunciona from '@/features/landing/ComoFunciona'
import Portada from '@/features/landing/Portada'

// Página de inicio (pública): portada, beneficios y cómo funciona.
export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24">
      <Portada />
      <Beneficios />
      <ComoFunciona />
    </div>
  )
}
