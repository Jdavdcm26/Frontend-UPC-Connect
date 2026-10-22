import { UserCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { bloquear, listarBloqueados } from '@/features/red/redApi'
import { ETIQUETA_ROL_BLOQUEADO, type CuentaBloqueada } from '@/features/red/tipos'
import { mensajeDeError } from '@/shared/lib/erroresServidor'
import { formatearFecha } from '@/shared/lib/fechas'
import { rutaPerfilPublico } from '@/shared/lib/rutas'
import EmptyState from '@/shared/ui/EmptyState'
import EncabezadoPagina from '@/shared/ui/EncabezadoPagina'
import ErrorState from '@/shared/ui/ErrorState'
import { claseEnlace } from '@/shared/ui/estilosEnlace'

// Cuentas que la persona bloqueó, para desbloquearlas (HU-31).
export default function BloqueadosPage() {
  const [lista, setLista] = useState<CuentaBloqueada[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<unknown>()
  const [intento, setIntento] = useState(0)
  // Id de la cuenta que se está desbloqueando.
  const [desbloqueando, setDesbloqueando] = useState<string>()

  useEffect(() => {
    let vigente = true
    listarBloqueados()
      .then((datos) => {
        if (vigente) setLista(datos)
      })
      .catch((e) => {
        if (vigente) setError(e)
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })
    return () => {
      vigente = false
    }
  }, [intento])

  function reintentar() {
    setCargando(true)
    setError(undefined)
    setIntento((n) => n + 1)
  }

  async function desbloquear(cuenta: CuentaBloqueada) {
    setDesbloqueando(cuenta.id)
    try {
      await bloquear(cuenta.id, false)
      setLista((actual) => actual.filter((c) => c.id !== cuenta.id))
      toast.success(`Desbloqueaste a ${cuenta.nombre}.`)
    } catch (e) {
      toast.error(mensajeDeError(e, 'No pudimos desbloquear la cuenta. Intenta de nuevo.'))
    } finally {
      setDesbloqueando(undefined)
    }
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <EncabezadoPagina
        titulo="Cuentas bloqueadas"
        descripcion="No ves sus publicaciones ni comentarios, y esas cuentas tampoco ven los tuyos. Puedes desbloquearlas cuando quieras."
      />

      {cargando && (
        <div className="space-y-3" role="status" aria-label="Cargando cuentas bloqueadas">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      )}

      {!cargando && error !== undefined && (
        <ErrorState mensaje="No pudimos cargar las cuentas bloqueadas. Intenta de nuevo en un momento." onReintentar={reintentar} />
      )}

      {!cargando && error === undefined && lista.length === 0 && (
        <EmptyState titulo="No has bloqueado ninguna cuenta" descripcion="Puedes bloquear a alguien desde su perfil." />
      )}

      {lista.length > 0 && (
        <ul className="space-y-3">
          {lista.map((cuenta) => (
            <li key={cuenta.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-sm sm:p-5">
              <div className="min-w-0 space-y-0.5">
                <p className="break-words font-semibold">
                  {cuenta.slug ? (
                    <Link to={rutaPerfilPublico(cuenta.slug)} className={claseEnlace}>
                      {cuenta.nombre}
                    </Link>
                  ) : (
                    cuenta.nombre
                  )}
                </p>
                <p className="text-sm text-muted-foreground">
                  {ETIQUETA_ROL_BLOQUEADO[cuenta.rol] ?? cuenta.rol} · Bloqueada el {formatearFecha(cuenta.bloqueadaEn)}
                </p>
              </div>
              <Button variant="outline" size="sm" disabled={desbloqueando === cuenta.id} onClick={() => void desbloquear(cuenta)}>
                <UserCheck aria-hidden="true" />
                {desbloqueando === cuenta.id ? 'Desbloqueando...' : 'Desbloquear'}
                <span className="sr-only"> a {cuenta.nombre}</span>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
