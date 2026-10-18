import AppShell from '@/app/layouts/AppShell'
import { ENLACES_CANDIDATO } from '@/app/navegacion'

// Diseño para estudiantes y egresados con sesión iniciada.
export default function CandidateLayout() {
  return <AppShell nombre="UPC Connect · Candidato" enlaces={ENLACES_CANDIDATO} />
}