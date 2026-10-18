import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { contrasena, correo } from '@/shared/lib/validaciones'
import EmptyState from '@/shared/ui/EmptyState'
import ErrorState from '@/shared/ui/ErrorState'
import FormField from '@/shared/ui/FormField'

// Esquema de validación del formulario de ejemplo (Zod).
const esquema = z.object({ correo, contrasena })
type Datos = z.infer<typeof esquema>

// Página interna que muestra los componentes base (HU-61).
export default function CatalogoPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Datos>({ resolver: zodResolver(esquema) })

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">Catálogo de componentes</h1>

      <Card>
        <CardHeader>
          <CardTitle>Formulario de ejemplo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(() => undefined)} className="space-y-4" noValidate>
            <FormField
              id="correo"
              etiqueta="Correo institucional"
              ayuda="Usa tu correo de la UPC."
              error={errors.correo?.message}
            >
              {(campo) => <Input type="email" {...campo} {...register('correo')} />}
            </FormField>
            <FormField id="contrasena" etiqueta="Contraseña" error={errors.contrasena?.message}>
              {(campo) => <Input type="password" {...campo} {...register('contrasena')} />}
            </FormField>
            <Button type="submit">Enviar</Button>
          </form>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Badge>Nuevo</Badge>
        <Badge variant="outline">Pendiente</Badge>
      </div>

      <Skeleton className="h-10 w-full" />

      <EmptyState titulo="Sin vacantes" descripcion="Cuando haya vacantes publicadas aparecerán aquí." />

      <ErrorState mensaje="No pudimos cargar la información." onReintentar={() => undefined} />
    </div>
  )
}