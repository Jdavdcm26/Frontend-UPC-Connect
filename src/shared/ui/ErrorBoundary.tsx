import { Component, type ReactNode } from 'react'
import ErrorState from '@/shared/ui/ErrorState'

type Props = { children: ReactNode }
type Estado = { huboError: boolean }

// Atrapa errores de renderizado para no dejar la pantalla en blanco.
// React exige que sea una clase: no existe versión con funciones.
export default class ErrorBoundary extends Component<Props, Estado> {
  state: Estado = { huboError: false }

  static getDerivedStateFromError(): Estado {
    return { huboError: true }
  }

  render() {
    if (this.state.huboError) {
      return (
        <ErrorState
          mensaje="Algo salió mal. Recarga la página e inténtalo de nuevo."
          onReintentar={() => window.location.reload()}
        />
      )
    }
    return this.props.children
  }
}