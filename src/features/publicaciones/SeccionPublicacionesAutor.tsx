import { Newspaper } from 'lucide-react'
import { useId, useState } from 'react'
import FeedPublicaciones from '@/features/publicaciones/FeedPublicaciones'
import { FILTROS_PUBLICACIONES_VACIOS } from '@/features/publicaciones/filtros'

type Props = {
  titulo: string
  autorId: string
  puedeInteractuar: boolean
  textoVacio: string
}

// Publicaciones de una persona, para su perfil: título y la lista con «Cargar más».
// Va sin tarjeta propia porque cada publicación ya es una tarjeta.
export default function SeccionPublicacionesAutor({ titulo, autorId, puedeInteractuar, textoVacio }: Props) {
  const idTitulo = useId()
  // Cambiar este número monta de nuevo la lista (botón «Reintentar»).
  const [intento, setIntento] = useState(0)

  return (
    <section aria-labelledby={idTitulo} className="space-y-4">
      <h2 id={idTitulo} className="flex items-center gap-2.5 text-xl font-semibold">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Newspaper aria-hidden="true" className="size-4.5" />
        </span>
        {titulo}
      </h2>
      <FeedPublicaciones
        key={`${autorId}-${intento}`}
        filtros={FILTROS_PUBLICACIONES_VACIOS}
        autorId={autorId}
        puedeInteractuar={puedeInteractuar}
        vacio={{ titulo: 'Sin publicaciones', descripcion: textoVacio }}
        onReintentar={() => setIntento((n) => n + 1)}
      />
    </section>
  )
}
