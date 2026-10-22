import { Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { etiquetaNivel } from '@/features/perfil/formato'
import { agregarHabilidad, buscarHabilidades, quitarHabilidad } from '@/features/perfil/habilidadesApi'
import { LIMITES } from '@/features/perfil/limites'
import SkillCombobox from '@/features/perfil/SkillCombobox'
import type { HabilidadCatalogo, HabilidadPerfil, NivelHabilidad, Perfil } from '@/features/perfil/tipos'
import { ApiError } from '@/shared/api/apiError'
import { useDebounce } from '@/shared/lib/useDebounce'
import EtiquetaQuitable from '@/shared/ui/EtiquetaQuitable'
import SelectField from '@/shared/ui/SelectField'

type Props = {
  habilidades: HabilidadPerfil[]
  // El servidor responde con el perfil actualizado: así la lista cambia de inmediato.
  onActualizar: (perfil: Perfil) => void
}

const SIN_NIVEL = 'SIN_NIVEL'
const NIVELES: NivelHabilidad[] = ['BASICO', 'INTERMEDIO', 'AVANZADO']
const OPCIONES_NIVEL = [
  { valor: SIN_NIVEL, etiqueta: 'Sin indicar' },
  ...NIVELES.map((nivel) => ({ valor: nivel, etiqueta: etiquetaNivel(nivel) })),
]

// Texto del error de una habilidad. En 422 el servidor lo da en habilidad_id (duplicada, máximo, etc.).
function mensajeDeError(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 422) return error.campos.habilidad_id?.[0] ?? error.message
    if (error.status === 404) return 'Guarda tu perfil antes de agregar habilidades.'
    return error.message
  }
  return 'No pudimos actualizar tus habilidades. Intenta de nuevo.'
}

// Habilidades del perfil: se buscan en el catálogo, se agregan sin duplicados y se quitan (HU-11 / FE-17).
// Cada cambio se guarda al momento y no depende del botón «Guardar perfil».
export default function SkillsEditor({ habilidades, onActualizar }: Props) {
  const entrada = useRef<HTMLInputElement>(null)
  const [texto, setTexto] = useState('')
  const [nivel, setNivel] = useState(SIN_NIVEL)
  const [error, setError] = useState<string>()
  const [sugerencias, setSugerencias] = useState<HabilidadCatalogo[]>()
  const [agregando, setAgregando] = useState(false)
  const [quitando, setQuitando] = useState(false)

  // Se busca cuando la persona deja de escribir, no en cada tecla.
  const busqueda = useDebounce(texto.trim())
  useEffect(() => {
    if (busqueda === '') return
    // Si llega una respuesta de una búsqueda vieja, se ignora.
    let vigente = true
    // Mientras llegan las nuevas sugerencias se siguen viendo las anteriores (no se borran aquí).
    buscarHabilidades(busqueda)
      .then((datos) => {
        if (vigente) setSugerencias(datos)
      })
      .catch(() => {
        if (vigente) setSugerencias([])
      })
    return () => {
      vigente = false
    }
  }, [busqueda])

  async function agregar(habilidad: HabilidadCatalogo) {
    setAgregando(true)
    try {
      const perfil = await agregarHabilidad(habilidad, nivel === SIN_NIVEL ? null : (nivel as NivelHabilidad))
      onActualizar(perfil)
      setTexto('')
      setError(undefined)
      toast.success('Habilidad agregada.')
    } catch (e) {
      setError(mensajeDeError(e))
    } finally {
      setAgregando(false)
    }
  }

  async function quitar(id: string) {
    setQuitando(true)
    try {
      const perfil = await quitarHabilidad(id)
      onActualizar(perfil)
      setError(undefined)
      toast.success('Habilidad quitada.')
      // La habilidad quitada desaparece junto con su botón: el foco vuelve al campo de búsqueda.
      entrada.current?.focus()
    } catch (e) {
      setError(mensajeDeError(e))
    } finally {
      setQuitando(false)
    }
  }

  const lleno = habilidades.length >= LIMITES.habilidades
  const yaAgregadas = new Set(habilidades.map((h) => h.id))
  // Con el texto vacío no se busca, así que no se muestran sugerencias viejas.
  const lista = busqueda === '' || texto.trim() === '' ? undefined : sugerencias

  return (
    <section
      aria-labelledby="titulo-habilidades"
      className="space-y-4 rounded-xl border bg-card p-5 shadow-sm sm:p-6"
    >
      <h2 id="titulo-habilidades" className="flex items-center gap-2.5 text-xl font-semibold">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
          <Zap aria-hidden="true" className="size-4.5" />
        </span>
        Habilidades
      </h2>

      <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
        <SkillCombobox
          id="buscar-habilidad"
          etiqueta="Agregar habilidad"
          ayuda={
            lleno
              ? `Llegaste al máximo de ${LIMITES.habilidades} habilidades. Quita alguna para agregar otra.`
              : 'Escribe para buscar en el catálogo y elige una opción.'
          }
          error={error}
          texto={texto}
          onTextoChange={(nuevo) => {
            setTexto(nuevo)
            setError(undefined)
          }}
          sugerencias={lista}
          yaAgregadas={yaAgregadas}
          onElegir={(habilidad) => {
            if (!agregando) void agregar(habilidad)
          }}
          deshabilitado={lleno}
          inputRef={entrada}
        />
        <SelectField
          id="nivel-habilidad"
          etiqueta="Nivel (opcional)"
          placeholder="Sin indicar"
          opciones={OPCIONES_NIVEL}
          valor={nivel}
          onChange={setNivel}
        />
      </div>

      {habilidades.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aún no has agregado habilidades.</p>
      ) : (
        <ul className="flex flex-wrap gap-2" aria-label="Habilidades agregadas">
          {habilidades.map((habilidad) => (
            <EtiquetaQuitable
              key={habilidad.id}
              texto={habilidad.nombre}
              detalle={habilidad.nivel ? etiquetaNivel(habilidad.nivel) : undefined}
              etiquetaQuitar={`Quitar ${habilidad.nombre}`}
              deshabilitado={quitando}
              onQuitar={() => void quitar(habilidad.id)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
