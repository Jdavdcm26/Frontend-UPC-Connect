import Portada from '@/features/landing/Portada'

// Página de inicio (pública): portada con la propuesta de valor y las acciones principales.
export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24">
      <Portada />
    </div>
  )
}
