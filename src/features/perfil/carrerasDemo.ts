import type { Carrera } from '@/features/perfil/tipos'

// Con fixtures: ids con forma de UUID, como los del servidor.
const id = (numero: number) => `00000000-0000-4000-8000-00000000000${numero}`

// Carreras de ejemplo (una desactivada, para probar esa regla).
export const CARRERAS_DEMO: Carrera[] = [
  { id: id(1), nombre: 'Ingeniería de Sistemas', facultad: 'Ingenierías y Tecnologías', activa: true },
  { id: id(2), nombre: 'Ingeniería Electrónica', facultad: 'Ingenierías y Tecnologías', activa: true },
  { id: id(3), nombre: 'Administración de Empresas', facultad: 'Ciencias Administrativas', activa: true },
  { id: id(4), nombre: 'Contaduría Pública', facultad: 'Ciencias Administrativas', activa: true },
  { id: id(5), nombre: 'Derecho', facultad: 'Ciencias Jurídicas', activa: true },
  { id: id(6), nombre: 'Tecnología en Sistemas (programa cerrado)', facultad: 'Ingenierías y Tecnologías', activa: false },
]