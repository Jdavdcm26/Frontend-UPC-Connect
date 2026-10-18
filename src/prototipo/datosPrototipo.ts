// Datos de ejemplo para el prototipo (FE-08). No son datos reales.
export type Vacante = {
  id: string
  titulo: string
  empresa: string
  ciudad: string
  modalidad: string
  tipo: string
  descripcion: string
}

export const vacantes: Vacante[] = [
  {
    id: '1',
    titulo: 'Practicante de desarrollo web',
    empresa: 'Tecnologías del Cesar (demo)',
    ciudad: 'Valledupar',
    modalidad: 'Presencial',
    tipo: 'Práctica',
    descripcion: 'Apoyo en el desarrollo de aplicaciones web con React y TypeScript.',
  },
  {
    id: '2',
    titulo: 'Auxiliar de soporte técnico',
    empresa: 'Redes del Caribe (demo)',
    ciudad: 'Valledupar',
    modalidad: 'Híbrido',
    tipo: 'Pasantía',
    descripcion: 'Atención de solicitudes de soporte y mantenimiento de equipos.',
  },
  {
    id: '3',
    titulo: 'Analista de datos junior',
    empresa: 'Datos y Región (demo)',
    ciudad: 'Remoto',
    modalidad: 'Remoto',
    tipo: 'Empleo',
    descripcion: 'Limpieza y análisis de datos con hojas de cálculo y SQL.',
  },
]