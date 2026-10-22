import { Link } from 'react-router-dom'
import type { Autor } from '@/features/publicaciones/tipos'
import { formatearFechaHora, formatearHace } from '@/shared/lib/fechas'
import { rutaPerfilPublico } from '@/shared/lib/rutas'
import AvatarIniciales from '@/shared/ui/AvatarIniciales'

type Props = {
  autor: Autor
  // Fecha y hora ISO de creación.
  creadaEn: string
  // Fecha de la última edición, si la hubo.
  editadaEn: string | null
  tamano?: 'sm' | 'md'
}

// Quién escribió y cuándo: avatar con iniciales, nombre con enlace a su perfil, carrera o titular y la fecha.
export default function PostAuthor({ autor, creadaEn, editadaEn, tamano = 'md' }: Props) {
  const subtitulo = autor.titular || autor.carrera
  return (
    <div className="flex min-w-0 items-start gap-3">
      <AvatarIniciales nombres={autor.nombres} apellidos={autor.apellidos} tamano={tamano} />
      <div className="min-w-0 space-y-0.5">
        <p className="break-words text-sm font-semibold">
          {autor.slug ? (
            <Link
              to={rutaPerfilPublico(autor.slug)}
              className="rounded outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {autor.nombreCompleto}
            </Link>
          ) : (
            autor.nombreCompleto
          )}
        </p>
        {subtitulo && <p className="break-words text-xs text-muted-foreground">{subtitulo}</p>}
        <p className="text-xs text-muted-foreground">
          <time dateTime={creadaEn} title={formatearFechaHora(creadaEn)}>
            {formatearHace(creadaEn)}
          </time>
          {editadaEn && (
            <span title={`Editada ${formatearFechaHora(editadaEn)}`}> · Editada</span>
          )}
        </p>
      </div>
    </div>
  )
}
