import type { PerfilDatos } from '@/features/perfil/perfilEsquema'
import type { Perfil } from '@/features/perfil/tipos'

// Forma en que el servidor envía el perfil (GET y PUT /api/v1/me/perfil, dentro de { data }).
export type PerfilServidor = {
  nombres: string
  apellidos: string
  titular: string | null
  descripcion: string | null
  carrera: { id: string; nombre: string; facultad: string }
  semestre: number | null
  anio_grado: number | null
  ciudad: string | null
  intereses: string[]
}

// Del perfil del servidor al perfil de la interfaz.
export function perfilDesdeServidor(p: PerfilServidor): Perfil {
  return {
    nombres: p.nombres,
    apellidos: p.apellidos,
    titular: p.titular ?? '',
    descripcion: p.descripcion ?? '',
    carreraId: p.carrera.id,
    carreraNombre: p.carrera.nombre,
    semestre: p.semestre,
    anioGrado: p.anio_grado,
    ciudad: p.ciudad ?? '',
    intereses: p.intereses,
  }
}

// Cuerpo del PUT /api/v1/me/perfil. El servidor rechaza el semestre en egresados y el año de grado
// en estudiantes, así que solo se envía el que corresponde.
export function cuerpoPerfil(perfil: Perfil) {
  return {
    nombres: perfil.nombres,
    apellidos: perfil.apellidos,
    titular: perfil.titular,
    descripcion: perfil.descripcion,
    carrera_id: perfil.carreraId,
    ...(perfil.semestre === null ? {} : { semestre: perfil.semestre }),
    ...(perfil.anioGrado === null ? {} : { anio_grado: perfil.anioGrado }),
    ciudad: perfil.ciudad,
    intereses: perfil.intereses,
  }
}

// Del formulario (todo texto) al perfil real. Los egresados llevan año de grado y no semestre;
// los estudiantes, al revés. La carrera es un UUID y su nombre se conoce al elegirla.
export function datosAPerfil(datos: PerfilDatos, esEgresado: boolean, carreraNombre: string): Perfil {
  return {
    nombres: datos.nombres,
    apellidos: datos.apellidos,
    titular: datos.titular,
    descripcion: datos.descripcion,
    carreraId: datos.carreraId,
    carreraNombre,
    semestre: esEgresado ? null : Number(datos.semestre),
    anioGrado: esEgresado && datos.anioGrado !== '' ? Number(datos.anioGrado) : null,
    ciudad: datos.ciudad,
    intereses: datos.intereses,
  }
}

// Del perfil real a los valores del formulario. Sin perfil (primer acceso): formulario vacío.
export function perfilAFormulario(perfil: Perfil | null): PerfilDatos {
  if (!perfil) {
    return {
      nombres: '',
      apellidos: '',
      titular: '',
      descripcion: '',
      carreraId: '',
      semestre: '',
      anioGrado: '',
      ciudad: '',
      intereses: [],
    }
  }
  return {
    nombres: perfil.nombres,
    apellidos: perfil.apellidos,
    titular: perfil.titular,
    descripcion: perfil.descripcion,
    carreraId: perfil.carreraId,
    semestre: perfil.semestre === null ? '' : String(perfil.semestre),
    anioGrado: perfil.anioGrado === null ? '' : String(perfil.anioGrado),
    ciudad: perfil.ciudad,
    intereses: perfil.intereses,
  }
}