import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { etiquetaNivel } from '@/features/perfil/formato'
import { agregarHabilidad, buscarHabilidades, claveHabilidades, quitarHabilidad } from '@/features/perfil/habilidadesApi'
import { LIMITES } from '@/features/perfil/limites'
import { CLAVE_PERFIL } from '@/features/perfil/perfilApi'
import SkillCombobox from '@/features/perfil/SkillCombobox'
import type { HabilidadCatalogo, HabilidadPerfil, NivelHabilidad, Perfil } from '@/features/perfil/tipos'
import { ApiError } from '@/shared/api/apiError'
import { useDebounce } from '@/shared/lib/useDebounce'
import SelectField from '@/shared/ui/SelectField'

type Props = {
  habilidades: HabilidadPerfil[]
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
export default function SkillsEditor({ habilidades }: Props) {
  const queryClient = useQueryClient()
  const entrada = useRef<HTMLInputElement>(null)
  const [texto, setTexto] = useState('')
  const [nivel, setNivel] = useState(SIN_NIVEL)
  const [error, setError] = useState<string>()

  // Se busca cuando la persona deja de escribir, no en cada tecla.
  const busqueda = useDebounce(texto.trim())
  const sugerencias = useQuery({
    queryKey: claveHabilidades(busqueda),
    queryFn: () => buscarHabilidades(busqueda),
    enabled: busqueda !== '',
    // El catálogo cambia poco: no hace falta pedirlo de nuevo cada vez.
    staleTime: 5 * 60 * 1000,
    // Mientras llegan las nuevas sugerencias se siguen viendo las anteriores.
    placeholderData: keepPreviousData,
  })

  // El servidor responde con el perfil actualizado: así la lista cambia de inmediato.
  const alActualizar = (perfil: Perfil) => queryClient.setQueryData(CLAVE_PERFIL, perfil)

  const agregar = useMutation({
    mutationFn: (habilidad: HabilidadCatalogo) =>
      agregarHabilidad(habilidad, nivel === SIN_NIVEL ? null : (nivel as NivelHabilidad)),
    onSuccess: (perfil) => {
      alActualizar(perfil)
      setTexto('')
      setError(undefined)
      toast.success('Habilidad agregada.')
    },
    onError: (e) => setError(mensajeDeError(e)),
  })

  const quitar = useMutation({
    mutationFn: quitarHabilidad,
    onSuccess: (perfil) => {
      alActualizar(perfil)
      setError(undefined)
      toast.success('Habilidad quitada.')
      // La habilidad quitada desaparece junto con su botón: el foco vuelve al campo de búsqueda.
      entrada.current?.focus()
    },
    onError: (e) => setError(mensajeDeError(e)),
  })

  const lleno = habilidades.length >= LIMITES.habilidades
  const yaAgregadas = new Set(habilidades.map((h) => h.id))
  // Con el texto vacío no se busca, así que no se muestran sugerencias viejas.
  const lista = busqueda === '' || texto.trim() === '' ? undefined : sugerencias.data

  return (
    <section aria-labelledby="titulo-habilidades" className="space-y-4">
      <h2 id="titulo-habilidades" className="text-lg font-semibold">
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
            if (!agregar.isPending) agregar.mutate(habilidad)
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
            <li key={habilidad.id} className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm">
              {habilidad.nombre}
              {habilidad.nivel && <span className="text-muted-foreground"> · {etiquetaNivel(habilidad.nivel)}</span>}
              <button
                type="button"
                aria-label={`Quitar ${habilidad.nombre}`}
                disabled={quitar.isPending}
                className="rounded-full px-1 hover:bg-muted disabled:opacity-50"
                onClick={() => quitar.mutate(habilidad.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
