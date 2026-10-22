import { useEffect, useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { FiltrosPublicaciones } from '@/features/publicaciones/filtros'
import PostCard from '@/features/publicaciones/PostCard'
import { listarPublicaciones } from '@/features/publicaciones/publicacionesApi'
import type { Publicacion } from '@/features/publicaciones/tipos'
import EmptyState from '@/shared/ui/EmptyState'
import ErrorState from '@/shared/ui/ErrorState'

type Props = {
  filtros: FiltrosPublicaciones
  // Solo las publicaciones de esta persona (su perfil).
  autorId?: string
  puedeInteractuar: boolean
  // Texto y acción del estado vacío, que cambian según la pantalla.
  vacio: { titulo: string; descripcion?: string; accion?: ReactNode }
  onReintentar: () => void
}

// Lista de publicaciones con «Cargar más» (cursor). El padre le pone key con los filtros:
// así, al cambiarlos, la lista se monta de nuevo y empieza desde la primera página.
export default function FeedPublicaciones({ filtros, autorId, puedeInteractuar, vacio, onReintentar }: Props) {
  const [lista, setLista] = useState<Publicacion[]>([])
  const [siguiente, setSiguiente] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [cargandoMas, setCargandoMas] = useState(false)
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    let vigente = true
    listarPublicaciones(filtros, null, autorId)
      .then((pagina) => {
        if (!vigente) return
        setLista(pagina.publicaciones)
        setSiguiente(pagina.siguiente)
      })
      .catch((e) => {
        if (vigente) setError(e)
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })
    return () => {
      vigente = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo al montar: el padre le pone key con los filtros.
  }, [])

  async function cargarMas() {
    if (siguiente === null) return
    setCargandoMas(true)
    setError(undefined)
    try {
      const pagina = await listarPublicaciones(filtros, siguiente, autorId)
      setLista((actual) => [...actual, ...pagina.publicaciones.filter((p) => !actual.some((a) => a.id === p.id))])
      setSiguiente(pagina.siguiente)
    } catch (e) {
      setError(e)
    } finally {
      setCargandoMas(false)
    }
  }

  if (cargando) {
    return (
      <div className="space-y-4" role="status" aria-label="Cargando publicaciones">
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error !== undefined && lista.length === 0 && (
        <ErrorState mensaje="No pudimos cargar las publicaciones. Intenta de nuevo en un momento." onReintentar={onReintentar} />
      )}

      {error === undefined && lista.length === 0 && (
        <EmptyState titulo={vacio.titulo} descripcion={vacio.descripcion} accion={vacio.accion} />
      )}

      {lista.length > 0 && (
        <ul className="space-y-4">
          {lista.map((publicacion) => (
            <li key={publicacion.id}>
              <PostCard publicacion={publicacion} puedeInteractuar={puedeInteractuar} />
            </li>
          ))}
        </ul>
      )}

      {error !== undefined && lista.length > 0 && (
        <p role="alert" className="text-center text-sm text-destructive">
          No pudimos cargar más publicaciones. Intenta de nuevo.
        </p>
      )}

      {siguiente !== null && lista.length > 0 && (
        <div className="text-center">
          <Button variant="outline" disabled={cargandoMas} onClick={() => void cargarMas()}>
            {cargandoMas ? 'Cargando...' : 'Cargar más'}
          </Button>
        </div>
      )}
    </div>
  )
}
