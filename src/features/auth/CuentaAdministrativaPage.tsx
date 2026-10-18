import { Navigate } from 'react-router-dom'
import CerrarSesionBoton from '@/features/auth/CerrarSesionBoton'
import { rutaInicioPorRol } from '@/features/auth/rutaPorRol'
import { useSession } from '@/features/auth/useSession'
import { RUTAS } from '@/shared/lib/rutas'

// Aviso para cuentas de administración y moderación, que no usan esta aplicación.
// Un candidato o una empresa que llegue aquí va a su propio inicio.
export default function CuentaAdministrativaPage() {
  const { usuario } = useSession()

  if (usuario && usuario.rol !== 'admin' && usuario.rol !== 'moderador') {
    return <Navigate to={rutaInicioPorRol(usuario.rol)} replace />
  }

  return (
    <section className="mx-auto max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-bold">Cuenta administrativa</h1>
      <p>Tu cuenta se gestiona desde el panel de administración.</p>
      {usuario?.rol === 'admin' ? (
        <p>
          <a href={RUTAS.panelAdministracion} className="underline">
            Ir al panel de administración
          </a>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Las cuentas de moderación todavía no tienen pantallas en esta aplicación.
        </p>
      )}
      <CerrarSesionBoton />
    </section>
  )
}