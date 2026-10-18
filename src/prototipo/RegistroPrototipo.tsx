import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import FormField from '@/shared/ui/FormField'

// Prototipo de baja fidelidad (FE-08): no envía datos, solo navega al siguiente paso.
export default function RegistroPrototipo() {
  const navegar = useNavigate()

  return (
    <form
      onSubmit={(evento) => {
        evento.preventDefault()
        navegar('/prototipo/revisa-correo')
      }}
      className="mx-auto max-w-sm space-y-4"
    >
      <h1 className="text-2xl font-bold">Crear cuenta</h1>
      <FormField id="correo" etiqueta="Correo institucional">
        {(campo) => <Input type="email" {...campo} />}
      </FormField>
      <FormField id="contrasena" etiqueta="Contraseña" ayuda="Mínimo 10 caracteres.">
        {(campo) => <Input type="password" {...campo} />}
      </FormField>
      <FormField id="confirmacion" etiqueta="Confirmar contraseña">
        {(campo) => <Input type="password" {...campo} />}
      </FormField>
      <Button type="submit" className="w-full">
        Registrarme
      </Button>
    </form>
  )
}