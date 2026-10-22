import { cn } from 'cn'

// Estilo de los enlaces del menú: el enlace de la pantalla actual va en verde suave y en negrita
// (no depende solo del color), el resto en gris con un fondo suave al pasar el mouse.
export function claseEnlaceMenu(activo: boolean, extra?: string) {
  return cn(
    'rounded-lg px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    activo
      ? 'bg-primary-soft font-semibold text-primary'
      : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
    extra,
  )
}
