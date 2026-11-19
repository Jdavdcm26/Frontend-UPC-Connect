import { Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  // Título de la pantalla (el único h1), por ejemplo «Hola, Ana».
  titulo: string
  // Línea breve bajo el título, por ejemplo la carrera y el semestre.
  detalle?: string
  children?: ReactNode
}

// Banner de bienvenida de los paneles de inicio: degradado institucional, saludo personalizado
// y una textura de rejilla muy tenue que aporta profundidad sin distraer.
export default function Saludo({ titulo, detalle, children }: Props) {
  return (
    <header className="degradado-institucional entrar relative isolate overflow-hidden rounded-[var(--radio-tarjeta)] p-6 text-white shadow-banner sm:p-9">
      <div aria-hidden="true" className="rejilla-sutil absolute inset-0 -z-10" />
      <div aria-hidden="true" className="absolute -right-20 -top-28 size-72 rounded-full border border-white/12" />
      <div aria-hidden="true" className="absolute -right-6 -top-12 size-44 rounded-full border border-white/10" />
      <div aria-hidden="true" className="absolute bottom-0 right-8 size-24 rounded-full bg-emerald-300/10 blur-2xl" />

      <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-emerald-50 ring-1 ring-white/20">
        <Sparkles aria-hidden="true" className="size-3.5" />
        Tu espacio UPC
      </span>
      <h1 className="mt-4 break-words text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.6rem]">
        {titulo}
      </h1>
      {detalle && <p className="mt-2 text-sm font-semibold text-emerald-100 sm:text-base">{detalle}</p>}
      {children && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">{children}</p>}
    </header>
  )
}
