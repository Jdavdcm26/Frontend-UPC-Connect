import { Button } from '@/components/ui/button'

// Página de inicio (pública). Se reemplazará por la landing real.
export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">UPC Connect</h1>
      <p>Red profesional de la comunidad de la Universidad Popular del Cesar.</p>
      <Button>Comenzar</Button>
    </div>
  )
}