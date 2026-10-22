import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { router } from '@/app/router'
import SessionProvider from '@/features/auth/SessionProvider'
import { registrarServiceWorker } from '@/pwa/registrarServiceWorker'
import ErrorBoundary from '@/shared/ui/ErrorBoundary'
import './index.css'

registrarServiceWorker()

// Punto de entrada: ErrorBoundary atrapa fallos de renderizado,
// SessionProvider guarda la sesion y React Router las rutas.
// Cada pantalla pide sus datos al servidor con useState + useEffect.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <SessionProvider>
        <RouterProvider router={router} />
        <Toaster />
      </SessionProvider>
    </ErrorBoundary>
  </StrictMode>,
)