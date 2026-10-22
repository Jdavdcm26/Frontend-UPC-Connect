import AppShell from '@/app/layouts/AppShell'
import { ENLACES_CANDIDATO } from '@/app/navegacion'

// Diseño para estudiantes y egresados con sesión iniciada.
export default function CandidateLayout() {
  return <AppShell subtitulo="Portal del candidato" enlaces={ENLACES_CANDIDATO} />
}