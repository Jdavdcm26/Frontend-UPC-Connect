import { cn } from 'cn'
import type { ImagenPublicacion } from '@/features/publicaciones/tipos'

// Cuadrícula con las imágenes de una publicación (hasta cuatro). Cada una abre su tamaño real
// en otra pestaña. No hay texto alternativo del autor, así que se describen por su posición.
export default function PostImages({ imagenes }: { imagenes: ImagenPublicacion[] }) {
  if (imagenes.length === 0) return null
  const total = imagenes.length
  return (
    <ul className={cn('grid gap-2', total === 1 ? 'grid-cols-1' : 'grid-cols-2')}>
      {imagenes.map((imagen, i) => (
        <li key={imagen.id} className={cn(total === 3 && i === 0 && 'col-span-2')}>
          <a
            href={imagen.url}
            target="_blank"
            rel="noreferrer"
            className="block overflow-hidden rounded-lg border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <img
              src={imagen.url}
              alt={`Imagen ${i + 1} de ${total} de la publicación (se abre en otra pestaña)`}
              loading="lazy"
              className={cn('w-full object-cover', total === 1 ? 'max-h-[28rem]' : 'aspect-[4/3]')}
            />
          </a>
        </li>
      ))}
    </ul>
  )
}
