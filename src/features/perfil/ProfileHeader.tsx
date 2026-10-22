import { GraduationCap, MapPin, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from 'cn'
import { buttonVariants } from '@/components/ui/button'
import { inicialesDeNombre } from '@/shared/lib/iniciales'
import { RUTAS } from '@/shared/lib/rutas'
import DatoIcono from '@/shared/ui/DatoIcono'

type Props = {
  nombres: string
  apellidos: string
  titular: string
  // Por ejemplo: «Ingeniería de Sistemas · Semestre 6».
  detalle: string
  ciudad?: string
  // En el perfil de otra persona no se ofrece editar (FE-26).
  soloLectura?: boolean
}

// Encabezado de un perfil: «Mi perfil» (HU-09 / FE-16) y el de otra persona (FE-26).
// Franja verde con las iniciales de la persona (todavía no hay foto), su nombre, titular y datos clave.
export default function ProfileHeader({ nombres, apellidos, titular, detalle, ciudad, soloLectura = false }: Props) {
  return (
    <header className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div aria-hidden="true" className="h-24 bg-linear-to-r from-primary to-emerald-600 sm:h-28" />
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="-mt-12 flex flex-wrap items-end justify-between gap-4">
          <span
            aria-hidden="true"
            className="flex size-24 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground ring-4 ring-card"
          >
            {inicialesDeNombre(nombres, apellidos)}
          </span>
          {!soloLectura && (
            <Link to={RUTAS.perfilEditar} className={cn(buttonVariants({ variant: 'outline' }))}>
              <Pencil aria-hidden="true" />
              Editar perfil
            </Link>
          )}
        </div>

        <div className="mt-4 space-y-2">
          <h1 className="break-words text-2xl font-bold sm:text-3xl">
            {nombres} {apellidos}
          </h1>
          {titular && <p className="break-words text-lg">{titular}</p>}
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <DatoIcono icono={GraduationCap}>{detalle}</DatoIcono>
            {ciudad && (
              <DatoIcono icono={MapPin}>
                <span className="sr-only">Ciudad: </span>
                {ciudad}
              </DatoIcono>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
