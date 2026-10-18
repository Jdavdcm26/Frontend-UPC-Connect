import AppShell from '@/app/layouts/AppShell'
import { ENLACES_EMPRESA } from '@/app/navegacion'

// Diseño para cuentas de empresa con sesión iniciada.
export default function CompanyLayout() {
  return <AppShell nombre="UPC Connect · Empresa" enlaces={ENLACES_EMPRESA} />
}