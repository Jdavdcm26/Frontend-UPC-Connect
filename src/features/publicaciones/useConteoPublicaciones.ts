import { useEffect, useState } from 'react'
import { FILTROS_PUBLICACIONES_VACIOS } from '@/features/publicaciones/filtros'
import { listarPublicaciones } from '@/features/publicaciones/publicacionesApi'

const MAX_PAGINAS = 20

// Cuenta las publicaciones reales de una persona recorriendo el mismo endpoint paginado del feed.
// Devuelve null si no se pudo consultar, para que la pantalla pueda ocultar la cifra en vez de mostrar un 0 falso.
export function useConteoPublicaciones(autorId?: string): { total: number | null; cargando: boolean } {
  const [total, setTotal] = useState<number | null>(null)
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    if (!autorId) return
    let vigente = true

    async function contar() {
      setTotal(null)
      setCargando(true)
      try {
        let cursor: string | null = null
        let cantidad = 0
        let paginas = 0
        do {
          const pagina = await listarPublicaciones(FILTROS_PUBLICACIONES_VACIOS, cursor, autorId)
          cantidad += pagina.publicaciones.length
          cursor = pagina.siguiente
          paginas += 1
        } while (cursor !== null && paginas < MAX_PAGINAS)
        if (vigente) setTotal(cantidad)
      } catch {
        if (vigente) setTotal(null)
      } finally {
        if (vigente) setCargando(false)
      }
    }

    void contar()
    return () => {
      vigente = false
    }
  }, [autorId])

  return { total, cargando }
}
