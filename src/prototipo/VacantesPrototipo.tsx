import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { vacantes } from '@/prototipo/datosPrototipo'

// Prototipo de baja fidelidad (FE-08): listado de vacantes.
export default function VacantesPrototipo() {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Vacantes</h1>
      {vacantes.map((v) => (
        <Card key={v.id}>
          <CardHeader>
            <CardTitle>{v.titulo}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {v.empresa} · {v.ciudad}
            </p>
            <div className="flex gap-2">
              <Badge>{v.tipo}</Badge>
              <Badge variant="outline">{v.modalidad}</Badge>
            </div>
            <Link to={`/prototipo/vacantes/${v.id}`} className="text-primary underline">
              Ver detalle
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}