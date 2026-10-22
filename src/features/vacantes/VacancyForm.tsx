import { zodResolver } from '@hookform/resolvers/zod'
import { Rocket, Save } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Carrera } from '@/features/perfil/tipos'
import TargetCareersField from '@/features/vacantes/TargetCareersField'
import { LIMITES_VACANTE } from '@/features/vacantes/limites'
import { ETIQUETA_MODALIDAD, ETIQUETA_TIPO, MODALIDADES, TIPOS_VACANTE, type Vacante } from '@/features/vacantes/tipos'
import { vacanteEsquema, type VacanteDatos } from '@/features/vacantes/vacanteEsquema'
import { actualizarVacante, crearVacante } from '@/features/vacantes/vacantesApi'
import { ApiError } from '@/shared/api/apiError'
import { aplicarErroresServidor } from '@/shared/lib/erroresServidor'
import { hoyLocal } from '@/shared/lib/fechas'
import { RUTAS } from '@/shared/lib/rutas'
import FormField from '@/shared/ui/FormField'
import MensajeFormulario from '@/shared/ui/MensajeFormulario'
import SeccionFormulario from '@/shared/ui/SeccionFormulario'
import SelectField from '@/shared/ui/SelectField'

// Tipo y modalidad empiezan sin elegir (cadena vacía): el esquema pide elegirlos.
const VALORES_INICIALES: VacanteDatos = {
  tipo: '' as VacanteDatos['tipo'],
  titulo: '',
  descripcion: '',
  requisitos: '',
  carreraIds: [],
  ciudad: '',
  modalidad: '' as VacanteDatos['modalidad'],
  fechaCierre: '',
}

const OPCIONES_TIPO = TIPOS_VACANTE.map((valor) => ({ valor, etiqueta: ETIQUETA_TIPO[valor] }))
const OPCIONES_MODALIDAD = MODALIDADES.map((valor) => ({ valor, etiqueta: ETIQUETA_MODALIDAD[valor] }))

// Convierte una vacante existente en los valores del formulario.
function valoresDesdeVacante(vacante: Vacante): VacanteDatos {
  return {
    tipo: vacante.tipo,
    titulo: vacante.titulo,
    descripcion: vacante.descripcion,
    requisitos: vacante.requisitos,
    carreraIds: [...vacante.carreraIds],
    ciudad: vacante.ciudad,
    modalidad: vacante.modalidad,
    fechaCierre: vacante.fechaCierre,
  }
}

type Props = {
  carreras: Carrera[]
  // Si se indica, el formulario edita esa vacante; si no, publica una nueva.
  vacante?: Vacante
}

// Formulario para publicar o editar una vacante, práctica o pasantía (HU-41 / FE-19, FE-20).
export default function VacancyForm({ carreras, vacante }: Props) {
  const navigate = useNavigate()
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState<unknown>()
  const valoresIniciales = vacante ? valoresDesdeVacante(vacante) : VALORES_INICIALES

  const {
    register,
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<VacanteDatos>({
    resolver: zodResolver(vacanteEsquema),
    defaultValues: valoresIniciales,
  })

  // Las listas de vacantes se piden de nuevo solas al entrar a ellas, así que no hay nada más que actualizar.
  async function guardar(datos: VacanteDatos) {
    setEnviando(true)
    setErrorEnvio(undefined)
    try {
      if (vacante) {
        await actualizarVacante(vacante.id, datos)
        toast.success('Vacante actualizada.')
        void navigate(RUTAS.empresaVacantes)
      } else {
        await crearVacante(datos)
        toast.success('Vacante publicada.')
        reset(VALORES_INICIALES)
      }
    } catch (error) {
      // Los errores de validación (422) van a cada campo; el resto (por ejemplo, empresa no aprobada) se muestra arriba.
      setErrorEnvio(error)
      aplicarErroresServidor(error, setError)
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
        titulo="Información básica"
        descripcion="Qué tipo de oferta es, dónde se hace y hasta cuándo recibe postulaciones."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name="tipo"
            render={({ field }) => (
              <SelectField
                id="tipo"
                etiqueta="Tipo de oferta"
                placeholder="Elige el tipo"
                opciones={OPCIONES_TIPO}
                valor={field.value}
                onChange={field.onChange}
                error={errors.tipo?.message}
                inputRef={field.ref}
              />
            )}
          />
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

        <FormField id="titulo" etiqueta="Título" error={errors.titulo?.message}>
          {(campo) => <Input maxLength={LIMITES_VACANTE.titulo + 20} {...campo} {...register('titulo')} />}
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="ciudad" etiqueta="Ciudad" error={errors.ciudad?.message}>
            {(campo) => <Input {...campo} {...register('ciudad')} />}
          </FormField>
          <FormField id="fechaCierre" etiqueta="Fecha de cierre" error={errors.fechaCierre?.message}>
            {(campo) => <Input type="date" min={hoyLocal()} {...campo} {...register('fechaCierre')} />}
          </FormField>
        </div>
      </SeccionFormulario>

      <SeccionFormulario
        numero={2}
        titulo="Descripción y requisitos"
        descripcion="Cuenta qué hará la persona y qué necesita saber o tener."
      >
        <FormField
          id="descripcion"
          etiqueta="Descripción"
          ayuda={`Máximo ${LIMITES_VACANTE.descripcion} caracteres.`}
          error={errors.descripcion?.message}
        >
          {(campo) => <Textarea rows={5} {...campo} {...register('descripcion')} />}
        </FormField>

        <FormField
          id="requisitos"
          etiqueta="Requisitos"
          ayuda={`Máximo ${LIMITES_VACANTE.requisitos} caracteres.`}
          error={errors.requisitos?.message}
        >
          {(campo) => <Textarea rows={4} {...campo} {...register('requisitos')} />}
        </FormField>
      </SeccionFormulario>

      <SeccionFormulario
        numero={3}
        titulo="A quién va dirigida"
        descripcion="Elige las carreras que pueden postularse. Debes marcar al menos una."
      >
        <Controller
          control={control}
          name="carreraIds"
          render={({ field }) => (
            <TargetCareersField
              carreras={carreras}
              valor={field.value}
              onChange={field.onChange}
              error={errors.carreraIds?.message}
              inputRef={field.ref}
            />
          )}
        />
      </SeccionFormulario>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={enviando}>
          {vacante ? <Save aria-hidden="true" /> : <Rocket aria-hidden="true" />}
          {enviando ? (vacante ? 'Guardando...' : 'Publicando...') : vacante ? 'Guardar cambios' : 'Publicar vacante'}
        </Button>
      </div>
    </form>
  )
}
