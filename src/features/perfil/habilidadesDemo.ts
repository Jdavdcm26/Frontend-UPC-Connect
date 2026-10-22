import type { HabilidadCatalogo, TipoHabilidad } from '@/features/perfil/tipos'

// Con fixtures: catálogo de ejemplo, el mismo conjunto inicial que carga el backend.
const por = (tipo: TipoHabilidad, nombres: string[]): HabilidadCatalogo[] =>
  nombres.map((nombre) => ({ id: `habilidad-demo-${nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`, nombre, tipo }))

export const HABILIDADES_DEMO: HabilidadCatalogo[] = [
  ...por('TECNICA', [
    'Python', 'Java', 'JavaScript', 'TypeScript', 'PHP', 'SQL', 'React', 'Laravel',
    'Excel avanzado', 'Power BI', 'Análisis de datos', 'AutoCAD', 'Diseño gráfico',
    'Contabilidad financiera', 'Gestión de proyectos', 'Marketing digital',
  ]),
  ...por('BLANDA', [
    'Trabajo en equipo', 'Comunicación asertiva', 'Liderazgo', 'Resolución de problemas',
    'Pensamiento crítico', 'Gestión del tiempo', 'Adaptabilidad',
  ]),
  ...por('IDIOMA', ['Inglés', 'Francés', 'Portugués']),
]
