import ErrorState from '@/shared/ui/ErrorState'

// Pantalla de error general: la usa el enrutador cuando una ruta falla.
export default function ErrorPage() {
  return (
    <div className="p-8">
      <ErrorState
        mensaje="Ocurrió un error inesperado. Intenta de nuevo."
        onReintentar={() => window.location.reload()}
      />
    </div>
  )
}