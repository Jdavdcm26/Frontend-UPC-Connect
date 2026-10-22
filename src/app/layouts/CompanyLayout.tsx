import AppShell from '@/app/layouts/AppShell'
import { ENLACES_EMPRESA } from '@/app/navegacion'

// Diseño para cuentas de empresa con sesión iniciada.
export default function CompanyLayout() {
  return <AppShell subtitulo="Portal de empresas" enlaces={ENLACES_EMPRESA} />
}