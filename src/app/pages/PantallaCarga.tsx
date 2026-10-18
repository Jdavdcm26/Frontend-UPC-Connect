import { Skeleton } from '@/components/ui/skeleton'

// Pantalla de espera mientras se descarga la primera pantalla de la app.
export default function PantallaCarga() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 p-6" role="status" aria-label="Cargando">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-24 w-full" />
    </div>
  )
}
