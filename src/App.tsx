import { Button } from '@/components/ui/button'

// Pantalla de prueba: verifica el color primario y el foco visible (FE-02)
export default function App() {
  return (
    <main className="space-y-4 p-8">
      <h1 className="text-2xl font-bold">UPC Connect</h1>
      <div className="flex gap-2">
        <Button>Primario</Button>
        <Button variant="outline">Contorno</Button>
      </div>
    </main>
  )
}