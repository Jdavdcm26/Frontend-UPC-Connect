// Enlace para saltar el menú con el teclado: aparece al pulsar Tab (WCAG 2.4.1).
export default function SaltarAlContenido() {
  return (
    <a
      href="#contenido"
      className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-background focus:px-3 focus:py-2"
    >
      Saltar al contenido
    </a>
  )
}
