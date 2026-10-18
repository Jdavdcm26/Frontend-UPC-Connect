import { Link } from 'react-router'

export type Acceso = {
  ruta: string
  titulo: string
  descripcion: string
}

// Accesos directos a lo que más se usa en cada rol (HU-03 / FE-28 y FE-29).
export default function QuickActions({ accesos }: { accesos: Acceso[] }) {
  return (
    <nav aria-label="Accesos rápidos">
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-3">
        {accesos.map((acceso) => (
          <li key={acceso.ruta}>
            <Link to={acceso.ruta} className="block h-full rounded-lg border p-4 transition-colors hover:bg-accent">
              <span className="block font-semibold">{acceso.titulo}</span>
              <span className="block text-sm text-muted-foreground">{acceso.descripcion}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
