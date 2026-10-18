import { Link } from 'react-router-dom'
import { buttonVariants } from '@/components/ui/button'
import { RUTAS } from '@/shared/lib/rutas'

type Props = {
  nombre: string
  titular: string
  // Por ejemplo: «Ingeniería de Sistemas · Semestre 6».
  detalle: string
  // En el perfil de otra persona no se ofrece editar (FE-26).
  soloLectura?: boolean
}

// Encabezado de un perfil: «Mi perfil» (HU-09 / FE-16) y el de otra persona (FE-26).
export default function ProfileHeader({ nombre, titular, detalle, soloLectura = false }: Props) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{nombre}</h1>
        {titular && <p className="text-lg">{titular}</p>}
        <p className="text-sm text-muted-foreground">{detalle}</p>
      </div>
      {!soloLectura && (
        <Link to={RUTAS.perfilEditar} className={buttonVariants({ variant: 'outline', size: 'sm' })}>
          Editar perfil
        </Link>
      )}
    </header>
  )
}