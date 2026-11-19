import { GraduationCap, MapPin, Pencil, Users, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cn } from 'cn'
import { buttonVariants } from '@/components/ui/button'
import type { RedPropia } from '@/features/red/tipos'
import { inicialesDeNombre } from '@/shared/lib/iniciales'
import { RUTAS } from '@/shared/lib/rutas'
import DatoIcono from '@/shared/ui/DatoIcono'

type Estadisticas = {
  publicaciones?: number | null
  habilidades?: number
}

type Props = {
  nombres: string
  apellidos: string
  titular: string
  // Por ejemplo: «Ingeniería de Sistemas · Semestre 6».
  detalle: string
  ciudad?: string
  // En el perfil de otra persona no se ofrece editar (FE-26).
  soloLectura?: boolean
  // Seguidores y seguidos (HU-28). Sin dato no se muestran.
  contadores?: RedPropia
  // Cifras de actividad calculadas con datos reales del perfil y del feed.
  estadisticas?: Estadisticas
  // En el perfil de otra persona: seguir y bloquear.
  acciones?: ReactNode
}

// Encabezado de un perfil: «Mi perfil» (HU-09 / FE-16) y el de otra persona (FE-26).
// Franja degradada con las iniciales de la persona (todavía no hay foto), datos clave y actividad.
export default function ProfileHeader({
  nombres,
  apellidos,
  titular,
  detalle,
  ciudad,
  soloLectura = false,
  contadores,
  estadisticas,
  acciones,
}: Props) {
  const cifras: { valor: number | string; etiqueta: string; icono: LucideIcon }[] = []
  if (contadores) {
    cifras.push({ valor: contadores.seguidores, etiqueta: 'Seguidores', icono: Users })
    cifras.push({ valor: contadores.seguidos, etiqueta: 'Seguidos', icono: Users })
  }
  if (estadisticas?.publicaciones != null) {
    cifras.push({ valor: estadisticas.publicaciones, etiqueta: 'Publicaciones', icono: Pencil })
  }
  if (estadisticas?.habilidades != null) {
    cifras.push({ valor: estadisticas.habilidades, etiqueta: 'Habilidades', icono: GraduationCap })
  }

  return (
    <header className="tarjeta entrar overflow-hidden">
      <div aria-hidden="true" className="degradado-institucional relative h-32 sm:h-36">
        <div className="rejilla-sutil absolute inset-0" />
        <div className="absolute -right-10 -top-16 size-56 rounded-full border border-white/12" />
        <div className="absolute right-16 top-6 size-20 rounded-full bg-emerald-300/15 blur-xl" />
      </div>
      <div className="px-5 pb-6 sm:px-7 sm:pb-7">
        <div className="-mt-14 flex flex-wrap items-end justify-between gap-4">
          <span
            aria-hidden="true"
            className="flex size-28 items-center justify-center rounded-3xl bg-linear-to-br from-primary via-primary to-emerald-800 text-3xl font-extrabold text-white shadow-banner ring-4 ring-card sm:size-30"
          >
            {inicialesDeNombre(nombres, apellidos)}
          </span>
          {acciones && <div className="flex flex-wrap gap-2">{acciones}</div>}
          {!soloLectura && (
            <Link to={RUTAS.perfilEditar} className={cn(buttonVariants({ variant: 'default' }), 'shadow-card hover:shadow-lift')}>
              <Pencil aria-hidden="true" />
              Editar perfil
            </Link>
          )}
        </div>

        <div className="mt-5 space-y-2">
          <h1 className="break-words text-2xl font-extrabold sm:text-3xl">
            {nombres} {apellidos}
          </h1>
          {titular && <p className="break-words text-base font-medium text-primary sm:text-lg">{titular}</p>}
          <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
            <DatoIcono icono={GraduationCap}>{detalle}</DatoIcono>
            {ciudad && (
              <DatoIcono icono={MapPin}>
                <span className="sr-only">Ciudad: </span>
                {ciudad}
              </DatoIcono>
            )}
          </div>
        </div>

        {cifras.length > 0 && (
          <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-border/60 pt-5 sm:grid-cols-4">
            {cifras.map(({ valor, etiqueta, icono: Icono }) => (
              <div key={etiqueta} className="rounded-xl border border-border/60 bg-background/60 px-3.5 py-3">
                <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <Icono aria-hidden="true" className="size-3.5 text-primary" />
                  {etiqueta}
                </dt>
                <dd className="mt-1 text-xl font-extrabold tracking-tight text-foreground tabular-nums">{valor}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </header>
  )
}
