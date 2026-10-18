import type { EstadoCuenta } from '@/features/auth/tipos'
import EmptyState from '@/shared/ui/EmptyState'

type EstadoBloqueado = Exclude<EstadoCuenta, 'ACTIVO'>

const AVISOS: Record<EstadoBloqueado, { titulo: string; descripcion: string }> = {
  PENDIENTE: {
    titulo: 'Tu cuenta está pendiente',
    descripcion: 'Aún no ha sido activada. Cuando esté lista podrás entrar a esta sección.',
  },
  SUSPENDIDO: {
    titulo: 'Tu cuenta está suspendida',
    descripcion: 'No puedes entrar a esta sección. Comunícate con la administración de la UPC.',
  },
}

// Aviso para las cuentas que no están activas (no entran a rutas protegidas).
export default function AvisoCuenta({ estado }: { estado: EstadoBloqueado }) {
  const aviso = AVISOS[estado]
  return <EmptyState titulo={aviso.titulo} descripcion={aviso.descripcion} />
}