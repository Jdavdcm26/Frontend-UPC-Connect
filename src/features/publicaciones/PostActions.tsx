import { Lock, LockOpen, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cambiarApertura, eliminarPublicacion } from '@/features/publicaciones/publicacionesApi'
import type { Publicacion } from '@/features/publicaciones/tipos'
import { mensajeDeError } from '@/shared/lib/erroresServidor'
import { RUTAS, rutaEditarPublicacion } from '@/shared/lib/rutas'
import ConfirmDialog from '@/shared/ui/ConfirmDialog'

type Props = {
  publicacion: Publicacion
  onCambio: (publicacion: Publicacion) => void
}

// Acciones del autor sobre su publicación: editar (HU-22), cerrar o reabrir (HU-20) y eliminar (HU-23).
// Una publicación oculta por moderación ya no se edita ni se cierra: solo se puede eliminar.
export default function PostActions({ publicacion: p, onCambio }: Props) {
  const navigate = useNavigate()
  const [ocupado, setOcupado] = useState(false)
  const [confirmarEliminar, setConfirmarEliminar] = useState(false)
  const [confirmarCerrar, setConfirmarCerrar] = useState(false)

  async function cambiar(abierta: boolean) {
    setOcupado(true)
    try {
      onCambio(await cambiarApertura(p.id, abierta))
      toast.success(abierta ? 'Publicación reabierta.' : 'Publicación cerrada.')
    } catch (error) {
      toast.error(mensajeDeError(error, 'No pudimos cambiar la publicación. Intenta de nuevo.'))
    } finally {
      setOcupado(false)
    }
  }

  async function eliminar() {
    setOcupado(true)
    try {
      await eliminarPublicacion(p.id)
      toast.success('Publicación eliminada.')
      void navigate(RUTAS.publicaciones, { replace: true })
    } catch (error) {
      toast.error(mensajeDeError(error, 'No pudimos eliminar la publicación. Intenta de nuevo.'))
      setOcupado(false)
    }
  }

  const queOfrece = p.tipo === 'SERVICIO' ? 'el servicio' : 'la búsqueda'

  return (
    <div role="group" aria-label="Acciones de tu publicación" className="flex flex-wrap gap-2">
      {!p.oculta && (
        <Button asChild variant="outline" size="sm">
          <Link to={rutaEditarPublicacion(p.id)}>
            <Pencil aria-hidden="true" />
            Editar
          </Link>
        </Button>
      )}
      {!p.oculta && p.abierta === true && (
        <Button variant="outline" size="sm" disabled={ocupado} onClick={() => setConfirmarCerrar(true)}>
          <Lock aria-hidden="true" />
          Cerrar
        </Button>
      )}
      {!p.oculta && p.abierta === false && (
        <Button variant="outline" size="sm" disabled={ocupado} onClick={() => void cambiar(true)}>
          <LockOpen aria-hidden="true" />
          Reabrir
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        disabled={ocupado}
        onClick={() => setConfirmarEliminar(true)}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 aria-hidden="true" />
        Eliminar
      </Button>

      <ConfirmDialog
        abierto={confirmarCerrar}
        onAbiertoChange={setConfirmarCerrar}
        titulo="¿Cerrar esta publicación?"
        descripcion={`Se marcará como cerrada para que la comunidad sepa que ${queOfrece} ya no está disponible. Puedes reabrirla cuando quieras.`}
        etiquetaConfirmar="Cerrar"
        onConfirmar={() => void cambiar(false)}
      />
      <ConfirmDialog
        abierto={confirmarEliminar}
        onAbiertoChange={setConfirmarEliminar}
        titulo="¿Eliminar esta publicación?"
        descripcion="Dejará de mostrarse junto con sus comentarios y reacciones. Esta acción no se puede deshacer."
        etiquetaConfirmar="Eliminar"
        onConfirmar={() => void eliminar()}
      />
    </div>
  )
}
