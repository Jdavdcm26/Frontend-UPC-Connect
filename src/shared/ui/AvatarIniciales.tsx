import { cn } from 'cn'
import { iniciales, inicialesDeNombre } from '@/shared/lib/iniciales'

type Props =
  // Cuenta con sesión: solo se conoce el correo.
  | { correo: string; nombres?: never; apellidos?: never; tamano?: 'sm' | 'md' }
  // Otra persona (por ejemplo, el autor de una publicación): se conoce su nombre.
  | { correo?: never; nombres: string; apellidos: string; tamano?: 'sm' | 'md' }

const TAMANOS = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
} as const

// Círculo verde con las iniciales de una persona. No hay foto en esta versión.
// Con correo es el avatar de la sesión (se anuncia); con nombre es decorativo, porque el nombre ya se lee al lado.
export default function AvatarIniciales({ correo, nombres, apellidos, tamano = 'sm' }: Props) {
  const clases = cn(
    'inline-flex shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground',
    TAMANOS[tamano],
  )
  if (correo !== undefined) {
    return (
      <span role="img" aria-label={`Sesión de ${correo}`} title={correo} className={clases}>
        {iniciales(correo)}
      </span>
    )
  }
  return (
    <span aria-hidden="true" className={clases}>
      {inicialesDeNombre(nombres, apellidos)}
    </span>
  )
}
