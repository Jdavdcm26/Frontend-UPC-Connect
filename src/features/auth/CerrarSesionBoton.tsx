import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useSession } from '@/features/auth/useSession'
import { RUTAS } from '@/shared/lib/rutas'

// Cierra la sesión (HU-02 / FE-12) y lleva a la pantalla de inicio de sesión.
export default function CerrarSesionBoton() {
  const { cerrarSesion } = useSession()
  const navegar = useNavigate()

  async function alCerrar() {
    await cerrarSesion()
    navegar(RUTAS.iniciarSesion, { replace: true })
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={alCerrar}>
      Cerrar sesión
    </Button>
  )
}