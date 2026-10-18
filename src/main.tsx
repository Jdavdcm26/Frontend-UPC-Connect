import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { queryClient } from '@/app/queryClient'
import { router } from '@/app/router'
import ErrorBoundary from '@/shared/ui/ErrorBoundary'
import './index.css'

// Punto de entrada: ErrorBoundary atrapa fallos de renderizado,
// TanStack Query maneja los datos del servidor y React Router las rutas.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)