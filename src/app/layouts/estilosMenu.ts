import { cn } from 'cn'

// Estilo de los enlaces del menú: la sección actual lleva fondo verde suave, negrita, borde
// interior y una barra inferior; el resto queda en gris con un realce muy tenue al pasar el mouse.
export function claseEnlaceMenu(activo: boolean, extra?: string) {
  return cn(
    'group relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none',
    activo
      ? 'bg-primary/10 font-semibold text-primary shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--primary)_18%,transparent)] after:absolute after:inset-x-3 after:-bottom-[7px] after:h-0.5 after:rounded-full after:bg-primary'
      : 'font-medium text-muted-foreground hover:bg-primary/5 hover:text-foreground',
    extra,
  )
}
