import { Outlet } from 'react-router-dom'

// Diseño para estudiantes y egresados con sesión iniciada.
export default function CandidateLayout() {
  return (
    <div className="min-h-screen">
      <header className="border-b p-4 font-bold">UPC Connect · Candidato</header>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  )
}