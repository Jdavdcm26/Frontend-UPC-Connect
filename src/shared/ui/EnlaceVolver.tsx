import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { claseEnlace } from '@/shared/ui/estilosEnlace'

type Props = {
  to: string
  children: ReactNode
}

// Enlace para volver a la pantalla anterior, por ejemplo «Volver a mis vacantes».
export default function EnlaceVolver({ to, children }: Props) {
  return (
    <Link to={to} className={`${claseEnlace} inline-flex items-center gap-1.5 text-sm`}>
      <ArrowLeft aria-hidden="true" className="size-4" />
      {children}
    </Link>
  )
}
