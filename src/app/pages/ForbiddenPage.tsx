import { Link } from 'react-router-dom'

// Se muestra cuando la persona no tiene permiso para ver la página (403).
export default function ForbiddenPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Sin permiso</h1>
      <p>No tienes permiso para ver esta página.</p>
      <Link to="/" className="text-primary underline">
        Volver al inicio
      </Link>
    </div>
  )
}