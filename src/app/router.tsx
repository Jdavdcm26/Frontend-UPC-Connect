import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import AuthLayout from '@/app/layouts/AuthLayout'
import CandidateLayout from '@/app/layouts/CandidateLayout'
import CompanyLayout from '@/app/layouts/CompanyLayout'
import LayoutPorRol from '@/app/layouts/LayoutPorRol'
import PublicLayout from '@/app/layouts/PublicLayout'
import ErrorPage from '@/app/pages/ErrorPage'
import PantallaCarga from '@/app/pages/PantallaCarga'
import ForbiddenPage from '@/app/pages/ForbiddenPage'
import HomePage from '@/app/pages/HomePage'
import NotFoundPage from '@/app/pages/NotFoundPage'
import RedirigirSiHaySesion from '@/features/auth/RedirigirSiHaySesion'
import RequireAuth from '@/features/auth/RequireAuth'
import RequireRole from '@/features/auth/RequireRole'
import RequirePerfil from '@/features/perfil/RequirePerfil'

// Carga cada pantalla solo cuando se visita su ruta, para que la primera descarga sea liviana (FE-33).
const cargar = (importar: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await importar()).default,
})

// Rutas en espanol (RNF-27). Cada grupo usa su propio diseno.
// /inicio (candidato) y /empresa (empresa) exigen sesion activa y el rol correcto (FE-09).
export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ErrorPage />,
    // Se muestra mientras se descarga la primera pantalla.
    HydrateFallback: PantallaCarga,
    children: [
      { index: true, element: <RedirigirSiHaySesion><HomePage /></RedirigirSiHaySesion> },
      { path: 'catalogo', lazy: cargar(() => import('@/app/pages/CatalogoPage')) },
      { path: 'politica-de-privacidad', lazy: cargar(() => import('@/features/auth/PoliticaPrivacidadPage')) },
      {
        element: <AuthLayout />,
        children: [
          { path: 'iniciar-sesion', lazy: cargar(() => import('@/features/auth/LoginPage')) },
          { path: 'recuperar-contrasena', lazy: cargar(() => import('@/features/auth/RecuperarContrasenaPage')) },
          { path: 'restablecer-contrasena', lazy: cargar(() => import('@/features/auth/RestablecerContrasenaPage')) },
          { path: 'registro', lazy: cargar(() => import('@/features/auth/RegistroPage')) },
          { path: 'revisa-tu-correo', lazy: cargar(() => import('@/features/auth/RevisaCorreoPage')) },
          { path: 'verificar-correo', lazy: cargar(() => import('@/features/auth/VerificarCorreoPage')) },
        ],
      },
      { path: 'sin-permiso', element: <ForbiddenPage /> },
      {
        element: <RequireAuth />,
        children: [{ path: 'cuenta-administrativa', lazy: cargar(() => import('@/features/auth/CuentaAdministrativaPage')) }],
      },
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
                children: [{ index: true, lazy: cargar(() => import('@/features/inicio/InicioCandidatoPage')) }],
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
              { path: 'editar', lazy: cargar(() => import('@/features/perfil/PerfilEditarPage')) },
              { element: <RequirePerfil />, children: [{ index: true, lazy: cargar(() => import('@/features/perfil/PerfilPage')) }] },
            ],
          },
        ],
      },
    ],
  },
  {
    // Perfil de otra persona: lo ven candidatos y empresas, cada uno con su menú (FE-26).
    path: '/perfiles/:slug',
    element: <RequireAuth />,
    children: [
      {
        element: <LayoutPorRol />,
        children: [{ index: true, lazy: cargar(() => import('@/features/perfil/PerfilPublicoPage')) }],
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
                  { index: true, lazy: cargar(() => import('@/features/vacantes/VacantesPage')) },
                  { path: ':id', lazy: cargar(() => import('@/features/vacantes/VacanteDetallePage')) },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/mis-postulaciones',
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
                children: [{ index: true, lazy: cargar(() => import('@/features/postulaciones/MisPostulacionesPage')) }],
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
              { index: true, lazy: cargar(() => import('@/features/inicio/InicioEmpresaPage')) },
              { path: 'vacantes', lazy: cargar(() => import('@/features/vacantes/MisVacantesPage')) },
              { path: 'vacantes/nueva', lazy: cargar(() => import('@/features/vacantes/NuevaVacantePage')) },
              { path: 'vacantes/:id/editar', lazy: cargar(() => import('@/features/vacantes/EditarVacantePage')) },
              { path: 'vacantes/:id/postulaciones', lazy: cargar(() => import('@/features/postulaciones/PostulacionesRecibidasPage')) },
            ],
          },
        ],
      },
    ],
  },
])