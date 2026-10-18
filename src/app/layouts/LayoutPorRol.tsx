import { Navigate } from 'react-router-dom'
import CandidateLayout from '@/app/layouts/CandidateLayout'
import CompanyLayout from '@/app/layouts/CompanyLayout'
import { useSession } from '@/features/auth/useSession'
import { RUTAS } from '@/shared/lib/rutas'

// Para las pantallas que ven tanto candidatos como empresas (por ejemplo, el perfil de otra persona):
// cada rol ve su propio menú. Va dentro de RequireAuth.
export default function LayoutPorRol() {
  const { usuario } = useSession()
  if (usuario?.rol === 'candidato') return <CandidateLayout />
  if (usuario?.rol === 'empresa') return <CompanyLayout />
  // Admin y moderador gestionan su cuenta fuera de esta aplicación.
  return <Navigate to={usuario ? RUTAS.cuentaAdministrativa : RUTAS.sinPermiso} replace />
}
