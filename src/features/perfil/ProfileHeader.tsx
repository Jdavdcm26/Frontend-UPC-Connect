import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { RUTAS } from '@/shared/lib/rutas'

type Props = {
  nombre: string
  titular: string
  // Por ejemplo: «Ingeniería de Sistemas · Semestre 6».
  detalle: string
}

// Encabezado de «Mi perfil» (HU-09 / FE-16).
export default function ProfileHeader({ nombre, titular, detalle }: Props) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{nombre}</h1>
        {titular && <p className="text-lg">{titular}</p>}
        <p className="text-sm text-muted-foreground">{detalle}</p>
      </div>
      <Link to={RUTAS.perfilEditar} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
        Editar perfil
      </Link>
    </header>
  )
}