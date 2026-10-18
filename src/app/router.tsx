import { createBrowserRouter } from 'react-router-dom'
import AuthLayout from '@/app/layouts/AuthLayout'
import CandidateLayout from '@/app/layouts/CandidateLayout'
import CompanyLayout from '@/app/layouts/CompanyLayout'
import PublicLayout from '@/app/layouts/PublicLayout'
import CatalogoPage from '@/app/pages/CatalogoPage'
import ErrorPage from '@/app/pages/ErrorPage'
import ForbiddenPage from '@/app/pages/ForbiddenPage'
import HomePage from '@/app/pages/HomePage'
import NotFoundPage from '@/app/pages/NotFoundPage'
import CuentaAdministrativaPage from '@/features/auth/CuentaAdministrativaPage'
import LoginPage from '@/features/auth/LoginPage'
import PoliticaPrivacidadPage from '@/features/auth/PoliticaPrivacidadPage'
import RecuperarContrasenaPage from '@/features/auth/RecuperarContrasenaPage'
import RedirigirSiHaySesion from '@/features/auth/RedirigirSiHaySesion'
import RegistroPage from '@/features/auth/RegistroPage'
import RestablecerContrasenaPage from '@/features/auth/RestablecerContrasenaPage'
import RequireAuth from '@/features/auth/RequireAuth'
import RevisaCorreoPage from '@/features/auth/RevisaCorreoPage'
import VerificarCorreoPage from '@/features/auth/VerificarCorreoPage'
import RequireRole from '@/features/auth/RequireRole'
import EditarVacantePage from '@/features/vacantes/EditarVacantePage'
import MisVacantesPage from '@/features/vacantes/MisVacantesPage'
import NuevaVacantePage from '@/features/vacantes/NuevaVacantePage'
import PerfilEditarPage from '@/features/perfil/PerfilEditarPage'
import RequirePerfil from '@/features/perfil/RequirePerfil'
import PerfilPage from '@/features/perfil/PerfilPage'
import VacanteDetallePage from '@/features/vacantes/VacanteDetallePage'
import VacantesPage from '@/features/vacantes/VacantesPage'
import PerfilPrototipo from '@/prototipo/PerfilPrototipo'
import RegistroPrototipo from '@/prototipo/RegistroPrototipo'
import RevisaCorreoPrototipo from '@/prototipo/RevisaCorreoPrototipo'
import VacanteDetallePrototipo from '@/prototipo/VacanteDetallePrototipo'
import VacantesPrototipo from '@/prototipo/VacantesPrototipo'

// Rutas en espanol (RNF-27). Cada grupo usa su propio diseno.
// /inicio (candidato) y /empresa (empresa) exigen sesion activa y el rol correcto (FE-09).
export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <RedirigirSiHaySesion><HomePage /></RedirigirSiHaySesion> },
      { path: 'catalogo', element: <CatalogoPage /> },
      { path: 'politica-de-privacidad', element: <PoliticaPrivacidadPage /> },
      {
        element: <AuthLayout />,
        children: [
          { path: 'iniciar-sesion', element: <LoginPage /> },
          { path: 'recuperar-contrasena', element: <RecuperarContrasenaPage /> },
          { path: 'restablecer-contrasena', element: <RestablecerContrasenaPage /> },
          { path: 'registro', element: <RegistroPage /> },
          { path: 'revisa-tu-correo', element: <RevisaCorreoPage /> },
          { path: 'verificar-correo', element: <VerificarCorreoPage /> },
        ],
      },
      { path: 'sin-permiso', element: <ForbiddenPage /> },
      {
        element: <RequireAuth />,
        children: [{ path: 'cuenta-administrativa', element: <CuentaAdministrativaPage /> }],
      },
      // Prototipo navegable de baja fidelidad (FE-08). Se elimina al terminar el Sprint 4.
      { path: 'prototipo/registro', element: <RegistroPrototipo /> },
      { path: 'prototipo/revisa-correo', element: <RevisaCorreoPrototipo /> },
      { path: 'prototipo/perfil', element: <PerfilPrototipo /> },
      { path: 'prototipo/vacantes', element: <VacantesPrototipo /> },
      { path: 'prototipo/vacantes/:id', element: <VacanteDetallePrototipo /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/inicio',
    element: <RequireAuth />,
    children: [
      {
        element: <RequireRole rol="candidato" />,
        children: [
          {
            element: <CandidateLayout />,
            children: [
              {
                element: <RequirePerfil />,
                children: [{ index: true, element: <p>Panel del candidato (FE-28)</p> }],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/perfil',
    element: <RequireAuth />,
    children: [
      {
        element: <RequireRole rol="candidato" />,
        children: [
          {
            element: <CandidateLayout />,
            children: [
              { path: 'editar', element: <PerfilEditarPage /> },
              { element: <RequirePerfil />, children: [{ index: true, element: <PerfilPage /> }] },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/vacantes',
    element: <RequireAuth />,
    children: [
      {
        element: <RequireRole rol="candidato" />,
        children: [
          {
            element: <CandidateLayout />,
            children: [
              {
                element: <RequirePerfil />,
                children: [
                  { index: true, element: <VacantesPage /> },
                  { path: ':id', element: <VacanteDetallePage /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/empresa',
    element: <RequireAuth />,
    children: [
      {
        element: <RequireRole rol="empresa" />,
        children: [
          {
            element: <CompanyLayout />,
            children: [
              { index: true, element: <p>Panel de la empresa (FE-29)</p> },
              { path: 'vacantes', element: <MisVacantesPage /> },
              { path: 'vacantes/nueva', element: <NuevaVacantePage /> },
              { path: 'vacantes/:id/editar', element: <EditarVacantePage /> },
            ],
          },
        ],
      },
    ],
  },
])