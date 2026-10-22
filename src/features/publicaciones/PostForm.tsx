import { zodResolver } from '@hookform/resolvers/zod'
import { Send, Save } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { cn } from 'cn'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { publicacionAFormulario } from '@/features/publicaciones/conversiones'
import ImagePicker, { type ImagenElegida } from '@/features/publicaciones/ImagePicker'
import { filtrarImagenes } from '@/features/publicaciones/imagenes'
import { LIMITES_PUBLICACION } from '@/features/publicaciones/limites'
import PostTypeBadge from '@/features/publicaciones/PostTypeBadge'
import { publicacionEsquema, type PublicacionDatos } from '@/features/publicaciones/publicacionEsquema'
import { actualizarPublicacion, crearPublicacion } from '@/features/publicaciones/publicacionesApi'
import {
  AYUDA_TIPO_PUBLICACION,
  ETIQUETA_TIPO_PUBLICACION,
  TIPOS_PUBLICACION,
  type Categoria,
  type Publicacion,
} from '@/features/publicaciones/tipos'
import { ETIQUETA_MODALIDAD, MODALIDADES } from '@/features/vacantes/tipos'
import { ApiError } from '@/shared/api/apiError'
import { aplicarErroresServidor } from '@/shared/lib/erroresServidor'
import { rutaPublicacion } from '@/shared/lib/rutas'
import FormField from '@/shared/ui/FormField'
import MensajeFormulario from '@/shared/ui/MensajeFormulario'
import SeccionFormulario from '@/shared/ui/SeccionFormulario'
import SelectField from '@/shared/ui/SelectField'

const L = LIMITES_PUBLICACION

// El tipo empieza sin elegir (cadena vacía): el esquema pide elegirlo.
const VALORES_INICIALES: PublicacionDatos = {
  tipo: '' as PublicacionDatos['tipo'],
  categoriaId: '',
  contenido: '',
  area: '',
  modalidad: '',
  disponibilidad: '',
  proyecto: '',
  perfilesRequeridos: '',
  cupos: '',
}

const OPCIONES_MODALIDAD = MODALIDADES.map((valor) => ({ valor, etiqueta: ETIQUETA_MODALIDAD[valor] }))

type Props = {
  categorias: Categoria[]
  // Si se indica, el formulario edita esa publicación (sin cambiar el tipo ni las imágenes); si no, publica una nueva.
  publicacion?: Publicacion
  // Al editar, la sección de imágenes (se guarda aparte, al momento) va antes del botón de guardar.
  seccionImagenes?: ReactNode
}

// Formulario para publicar (HU-18 a HU-21) o editar (HU-22) una publicación de la comunidad.
export default function PostForm({ categorias, publicacion, seccionImagenes }: Props) {
  const navigate = useNavigate()
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState<unknown>()
  const [imagenes, setImagenes] = useState<ImagenElegida[]>([])
  const [erroresImagenes, setErroresImagenes] = useState<string[]>([])

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PublicacionDatos>({
    resolver: zodResolver(publicacionEsquema),
    defaultValues: publicacion ? publicacionAFormulario(publicacion) : VALORES_INICIALES,
  })

  const tipo = useWatch({ control, name: 'tipo' })
  const largoContenido = useWatch({ control, name: 'contenido' }).length

  // Las vistas previas usan direcciones temporales del navegador: se liberan al salir de la pantalla.
  // La referencia guarda la lista vigente para liberarla al desmontar.
  const imagenesActuales = useRef(imagenes)
  useEffect(() => {
    imagenesActuales.current = imagenes
  }, [imagenes])
  useEffect(() => () => imagenesActuales.current.forEach((i) => URL.revokeObjectURL(i.url)), [])

  // Una categoría desactivada después de publicar se conserva al editar: se agrega a la lista.
  const opcionesCategoria = [
    ...categorias,
    ...(publicacion && !categorias.some((c) => c.id === publicacion.categoria.id) ? [publicacion.categoria] : []),
  ].map((c) => ({ valor: c.id, etiqueta: c.nombre }))

  function elegirImagenes(archivos: File[]) {
    const { aceptadas, problemas } = filtrarImagenes(archivos, imagenes.length)
    setErroresImagenes(problemas)
    setImagenes((actuales) => [
      ...actuales,
      ...aceptadas.map((archivo) => ({ id: crypto.randomUUID(), archivo, url: URL.createObjectURL(archivo) })),
    ])
  }

  function quitarImagen(id: string) {
    setErroresImagenes([])
    setImagenes((actuales) => {
      const quitada = actuales.find((i) => i.id === id)
      if (quitada) URL.revokeObjectURL(quitada.url)
      return actuales.filter((i) => i.id !== id)
    })
  }

  async function guardar(datos: PublicacionDatos) {
    setEnviando(true)
    setErrorEnvio(undefined)
    setErroresImagenes([])
    try {
      if (publicacion) {
        await actualizarPublicacion(publicacion.id, datos)
        toast.success('Publicación actualizada.')
        void navigate(rutaPublicacion(publicacion.id))
      } else {
        const nueva = await crearPublicacion(
          datos,
          imagenes.map((i) => i.archivo),
        )
        toast.success('Publicación creada.')
        void navigate(rutaPublicacion(nueva.id))
      }
    } catch (error) {
      // Los errores de validación (422) van a cada campo; el resto (por ejemplo, sin perfil) se muestra arriba.
      setErrorEnvio(error)
      aplicarErroresServidor(error, setError)
      if (error instanceof ApiError && error.campos.imagenes) setErroresImagenes(error.campos.imagenes)
    } finally {
      setEnviando(false)
    }
  }

  const errorGeneral = errorEnvio instanceof ApiError && errorEnvio.status !== 422 ? errorEnvio.message : undefined

  return (
    <form noValidate onSubmit={handleSubmit(guardar)} className="space-y-6">
      {errorGeneral && <MensajeFormulario tipo="error">{errorGeneral}</MensajeFormulario>}

      <SeccionFormulario
        numero={1}
        titulo="Tipo y categoría"
        descripcion={publicacion ? 'El tipo de una publicación no cambia al editarla.' : 'Elige qué quieres compartir.'}
      >
        {publicacion ? (
          <p className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Tipo:</span>
            <PostTypeBadge tipo={publicacion.tipo} />
          </p>
        ) : (
          <Controller
            control={control}
            name="tipo"
            render={({ field }) => (
              <fieldset className="space-y-2" aria-describedby={errors.tipo ? 'tipo-error' : undefined}>
                <legend className="text-sm font-medium">Tipo de publicación</legend>
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={Boolean(errors.tipo)}
                  className="gap-3 sm:grid-cols-3"
                >
                  {TIPOS_PUBLICACION.map((valor) => (
                    <label
                      key={valor}
                      htmlFor={`tipo-${valor}`}
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted motion-reduce:transition-none',
                        field.value === valor && 'border-primary bg-primary-soft hover:bg-primary-soft',
                      )}
                    >
                      <RadioGroupItem id={`tipo-${valor}`} value={valor} className="mt-0.5" />
                      <span className="space-y-0.5">
                        <span className="block text-sm font-semibold">{ETIQUETA_TIPO_PUBLICACION[valor]}</span>
                        <span className="block text-xs text-muted-foreground">{AYUDA_TIPO_PUBLICACION[valor]}</span>
                      </span>
                    </label>
                  ))}
                </RadioGroup>
                {errors.tipo && (
                  <p id="tipo-error" role="alert" className="text-sm text-destructive">
                    {errors.tipo.message}
                  </p>
                )}
              </fieldset>
            )}
          />
        )}

        <Controller
          control={control}
          name="categoriaId"
          render={({ field }) => (
            <SelectField
              id="categoriaId"
              etiqueta="Categoría"
              placeholder="Elige la categoría"
              opciones={opcionesCategoria}
              valor={field.value}
              onChange={field.onChange}
              error={errors.categoriaId?.message}
              inputRef={field.ref}
            />
          )}
        />
      </SeccionFormulario>

      <SeccionFormulario numero={2} titulo="Contenido" descripcion="Escribe lo que quieres contarle a la comunidad.">
        <FormField
          id="contenido"
          etiqueta="Texto de la publicación"
          ayuda={`${largoContenido} de ${L.contenido} caracteres.`}
          error={errors.contenido?.message}
        >
          {(campo) => <Textarea rows={6} {...campo} {...register('contenido')} />}
        </FormField>

        {tipo === 'SERVICIO' && (
          <div className="space-y-4 rounded-lg border bg-tint p-4">
            <p className="text-sm font-medium">Datos del servicio</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField id="area" etiqueta="Área" ayuda="Por ejemplo, Cálculo o Diseño gráfico." error={errors.area?.message}>
                {(campo) => <Input {...campo} {...register('area')} />}
              </FormField>
              <Controller
                control={control}
                name="modalidad"
                render={({ field }) => (
                  <SelectField
                    id="modalidad"
                    etiqueta="Modalidad"
                    placeholder="Elige la modalidad"
                    opciones={OPCIONES_MODALIDAD}
                    valor={field.value}
                    onChange={field.onChange}
                    error={errors.modalidad?.message}
                    inputRef={field.ref}
                  />
                )}
              />
            </div>
            <FormField
              id="disponibilidad"
              etiqueta="Disponibilidad"
              ayuda="Días y horas en que puedes atender."
              error={errors.disponibilidad?.message}
            >
              {(campo) => <Input {...campo} {...register('disponibilidad')} />}
            </FormField>
          </div>
        )}

        {tipo === 'BUSQUEDA_EQUIPO' && (
          <div className="space-y-4 rounded-lg border bg-tint p-4">
            <p className="text-sm font-medium">Datos de la búsqueda</p>
            <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
              <FormField id="proyecto" etiqueta="Proyecto" error={errors.proyecto?.message}>
                {(campo) => <Input {...campo} {...register('proyecto')} />}
              </FormField>
              <FormField id="cupos" etiqueta="Cupos" ayuda={`Entre ${L.cuposMinimo} y ${L.cuposMaximo}.`} error={errors.cupos?.message}>
                {(campo) => (
                  <Input type="number" inputMode="numeric" min={L.cuposMinimo} max={L.cuposMaximo} {...campo} {...register('cupos')} />
                )}
              </FormField>
            </div>
            <FormField
              id="perfilesRequeridos"
              etiqueta="Perfiles que buscas"
              ayuda="Qué saberes o carreras necesita el equipo."
              error={errors.perfilesRequeridos?.message}
            >
              {(campo) => <Textarea rows={3} {...campo} {...register('perfilesRequeridos')} />}
            </FormField>
          </div>
        )}
      </SeccionFormulario>

      {!publicacion && (
        <SeccionFormulario numero={3} titulo="Imágenes" descripcion="Opcional. Revisa cómo se ven antes de publicar.">
          <ImagePicker
            id="imagenes"
            vistas={imagenes.map((i) => ({ id: i.id, url: i.url, nombre: i.archivo.name }))}
            restantes={L.imagenes - imagenes.length}
            onElegir={elegirImagenes}
            onQuitar={quitarImagen}
            ocupado={enviando}
            errores={erroresImagenes}
          />
        </SeccionFormulario>
      )}

      {seccionImagenes}

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={enviando}>
          {publicacion ? <Save aria-hidden="true" /> : <Send aria-hidden="true" />}
          {enviando ? (publicacion ? 'Guardando...' : 'Publicando...') : publicacion ? 'Guardar cambios' : 'Publicar'}
        </Button>
      </div>
    </form>
  )
}
