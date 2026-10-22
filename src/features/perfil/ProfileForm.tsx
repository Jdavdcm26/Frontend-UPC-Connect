import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import CareerSelect from '@/features/perfil/CareerSelect'
import { perfilAFormulario } from '@/features/perfil/conversiones'
import InterestsField from '@/features/perfil/InterestsField'
import { LIMITES } from '@/features/perfil/limites'
import { esquemaPerfil, type PerfilDatos } from '@/features/perfil/perfilEsquema'
import { guardarPerfil } from '@/features/perfil/perfilApi'
import SemesterField from '@/features/perfil/SemesterField'
import type { Carrera, Perfil } from '@/features/perfil/tipos'
import { ApiError } from '@/shared/api/apiError'
import FormField from '@/shared/ui/FormField'

type Props = {
  carreras: Carrera[]
  // null en el primer acceso: el formulario empieza vacío.
  perfil: Perfil | null
  // Los egresados escriben su año de grado y no tienen semestre; los estudiantes, al revés.
  esEgresado: boolean
  // Recibe el perfil que devuelve el servidor, para que la pantalla lo muestre de inmediato.
  onGuardado: (perfil: Perfil) => void
}

// Formulario para crear y editar el perfil básico (HU-09 / FE-15).
export default function ProfileForm({ carreras, perfil, esEgresado, onGuardado }: Props) {
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState<unknown>()
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PerfilDatos>({
    resolver: zodResolver(esquemaPerfil(esEgresado)),
    defaultValues: perfilAFormulario(perfil),
  })

  // El servidor solo lista las carreras activas. Si la carrera del perfil ya se desactivó,
  // se agrega para que siga elegida (el servidor la acepta).
  const carrerasConActual =
    perfil && !carreras.some((c) => c.id === perfil.carreraId)
      ? [...carreras, { id: perfil.carreraId, nombre: perfil.carreraNombre, facultad: '', activa: false }]
      : carreras

  async function guardar(datos: PerfilDatos) {
    setEnviando(true)
    setError(undefined)
    try {
      const nuevo = await guardarPerfil(datos, esEgresado)
      onGuardado(nuevo)
      toast.success('Perfil guardado.')
    } catch (e) {
      setError(e)
    } finally {
      setEnviando(false)
    }
  }

  const mensajeError = error
    ? error instanceof ApiError
      ? error.message
      : 'No pudimos guardar tu perfil. Intenta de nuevo.'
    : undefined

  return (
    <form noValidate onSubmit={handleSubmit(guardar)} className="space-y-4">
      {mensajeError && (
        <p role="alert" className="text-sm text-destructive">
          {mensajeError}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="nombres" etiqueta="Nombres" error={errors.nombres?.message}>
          {(campo) => <Input autoComplete="given-name" {...campo} {...register('nombres')} />}
        </FormField>
        <FormField id="apellidos" etiqueta="Apellidos" error={errors.apellidos?.message}>
          {(campo) => <Input autoComplete="family-name" {...campo} {...register('apellidos')} />}
        </FormField>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Controller
          control={control}
          name="carreraId"
          render={({ field }) => (
            <CareerSelect
              carreras={carrerasConActual}
              valor={field.value}
              onChange={field.onChange}
              error={errors.carreraId?.message}
              inputRef={field.ref}
            />
          )}
        />
        {esEgresado ? (
          <FormField id="anioGrado" etiqueta="Año de grado" ayuda="Por ejemplo, 2025." error={errors.anioGrado?.message}>
            {(campo) => <Input inputMode="numeric" maxLength={4} {...campo} {...register('anioGrado')} />}
          </FormField>
        ) : (
          <Controller
            control={control}
            name="semestre"
            render={({ field }) => (
              <SemesterField
                valor={field.value}
                onChange={field.onChange}
                error={errors.semestre?.message}
                inputRef={field.ref}
              />
            )}
          />
        )}
      </div>

      <FormField
        id="titular"
        etiqueta="Titular"
        ayuda="Una frase que te describa, por ejemplo: Estudiante de Ingeniería de Sistemas."
        error={errors.titular?.message}
      >
        {(campo) => <Input {...campo} {...register('titular')} />}
      </FormField>

      <FormField
        id="descripcion"
        etiqueta="Descripción"
        ayuda={`Máximo ${LIMITES.descripcion} caracteres.`}
        error={errors.descripcion?.message}
      >
        {(campo) => <Textarea rows={4} {...campo} {...register('descripcion')} />}
      </FormField>

      <FormField id="ciudad" etiqueta="Ciudad" error={errors.ciudad?.message}>
        {(campo) => <Input autoComplete="address-level2" {...campo} {...register('ciudad')} />}
      </FormField>

      <Controller
        control={control}
        name="intereses"
        render={({ field }) => (
          <InterestsField valor={field.value} onChange={field.onChange} error={errors.intereses?.message} />
        )}
      />

      <Button type="submit" disabled={enviando}>
        {enviando ? 'Guardando...' : 'Guardar perfil'}
      </Button>
    </form>
  )
}