import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const habilidades = ['React', 'TypeScript', 'SQL']

// Prototipo de baja fidelidad (FE-08): vista de "Mi perfil" con datos de ejemplo.
export default function PerfilPrototipo() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Mi perfil</h1>
      <Card>
        <CardHeader>
          <CardTitle>Ana Pérez (demo)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Ingeniería de Sistemas · 8.º semestre</p>
          <p>Estudiante interesada en desarrollo web y análisis de datos.</p>
          <div className="flex flex-wrap gap-2">
            {habilidades.map((h) => (
              <Badge key={h} variant="outline">
                {h}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <Link to="/prototipo/vacantes" className="text-primary underline">
        Ver vacantes
      </Link>
    </div>
  )
}