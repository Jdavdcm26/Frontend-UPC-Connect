import { Link } from 'react-router-dom'

// Se muestra cuando la dirección no existe (error 404).
export default function NotFoundPage() {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold">Página no encontrada</h1>
      <p>La dirección que buscas no existe.</p>
      <Link to="/" className="text-primary underline">
        Volver al inicio
      </Link>
    </div>
  )
}