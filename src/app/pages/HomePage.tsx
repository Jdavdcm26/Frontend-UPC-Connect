import Beneficios from '@/features/landing/Beneficios'
import Portada from '@/features/landing/Portada'

// Página de inicio (pública): portada y beneficios para cada tipo de cuenta.
export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24">
      <Portada />
      <Beneficios />
    </div>
  )
}
