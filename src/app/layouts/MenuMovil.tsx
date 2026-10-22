import { Menu } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { claseEnlaceMenu } from '@/app/layouts/estilosMenu'
import type { Enlace } from '@/app/navegacion'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import CerrarSesionBoton from '@/features/auth/CerrarSesionBoton'

type Props = {
  enlaces: Enlace[]
  correo?: string
}

// Menú del celular: un botón con tres rayas que abre un panel con los mismos enlaces del menú de escritorio.
// Cada enlace cierra el panel al tocarlo (el estado abierto/cerrado se guarda aquí).
export default function MenuMovil({ enlaces, correo }: Props) {
  const [abierto, setAbierto] = useState(false)

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu aria-hidden="true" />
          <span className="sr-only">Abrir menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Menú</SheetTitle>
          <SheetDescription>{correo ? `Sesión de ${correo}` : 'Navegación principal'}</SheetDescription>
        </SheetHeader>
        <nav aria-label="Principal" className="flex flex-col gap-1">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.ruta}
              to={enlace.ruta}
              end
              onClick={() => setAbierto(false)}
              className={({ isActive }) => claseEnlaceMenu(isActive, 'py-2.5 text-base')}
            >
              {enlace.etiqueta}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto">
          <CerrarSesionBoton size="default" className="w-full" />
        </div>
      </SheetContent>
    </Sheet>
  )
}
