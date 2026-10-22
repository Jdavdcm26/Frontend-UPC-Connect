import { iniciales } from '@/shared/lib/iniciales'

// Círculo verde con las iniciales de la cuenta. No hay foto en esta versión.
export default function AvatarIniciales({ correo }: { correo: string }) {
  return (
    <span
      role="img"
      aria-label={`Sesión de ${correo}`}
      title={correo}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
    >
      {iniciales(correo)}
    </span>
  )
}
