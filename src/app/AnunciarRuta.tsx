import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { tituloDeRuta } from '@/app/titulos'

// Al cambiar de pantalla (WCAG 2.4.2 y 2.4.3):
// - pone el título de la pestaña,
// - lleva el foco al contenido, para que quien usa el teclado no tenga que pasar de nuevo por el menú,
// - anuncia el nombre de la pantalla a los lectores de pantalla.
// Va dentro de cada diseño de página (PublicLayout y AppShell).
export default function AnunciarRuta() {
  const { pathname } = useLocation()
  const titulo = tituloDeRuta(pathname)
  const anterior = useRef(pathname)

  useEffect(() => {
    document.title = titulo
    // Al abrir la app por primera vez no se mueve el foco; solo cuando la persona cambia de pantalla.
    if (anterior.current !== pathname) {
      anterior.current = pathname
      document.getElementById('contenido')?.focus()
    }
  }, [pathname, titulo])

  return (
    <p role="status" className="sr-only">
      {titulo}
    </p>
  )
}
