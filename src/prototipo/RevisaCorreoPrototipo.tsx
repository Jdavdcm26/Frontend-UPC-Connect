import { Link } from 'react-router-dom'

// Prototipo de baja fidelidad (FE-08): aviso después del registro.
export default function RevisaCorreoPrototipo() {
  return (
    <div className="mx-auto max-w-sm space-y-3 text-center">
      <h1 className="text-2xl font-bold">Revisa tu correo</h1>
      <p>Te enviamos un enlace para verificar tu cuenta. Si no llega, revisa la carpeta de spam.</p>
      <Link to="/prototipo/perfil" className="text-primary underline">
        Continuar (simula la verificación)
      </Link>
    </div>
  )
}