import { createBrowserRouter } from 'react-router-dom'
import CandidateLayout from '@/app/layouts/CandidateLayout'
import CompanyLayout from '@/app/layouts/CompanyLayout'
import PublicLayout from '@/app/layouts/PublicLayout'
import HomePage from '@/app/pages/HomePage'
import NotFoundPage from '@/app/pages/NotFoundPage'

// Rutas en español (RNF-27). Cada grupo usa su propio diseño.
// Las rutas /candidato y /empresa se protegerán con sesión en FE-09.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/candidato',
    element: <CandidateLayout />,
    children: [{ index: true, element: <p>Panel del candidato (FE-28)</p> }],
  },
  {
    path: '/empresa',
    element: <CompanyLayout />,
    children: [{ index: true, element: <p>Panel de la empresa (FE-29)</p> }],
  },
])