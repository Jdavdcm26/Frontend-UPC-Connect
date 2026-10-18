import type { PerfilDatos } from '@/features/perfil/perfilEsquema'
import type { Perfil } from '@/features/perfil/tipos'

// Del formulario (todo texto) al perfil real (semestre y año con números; la carrera es un UUID).
export function datosAPerfil(datos: PerfilDatos): Perfil {
  return {
    nombres: datos.nombres,
    apellidos: datos.apellidos,
    titular: datos.titular,
    descripcion: datos.descripcion,
    carreraId: datos.carreraId,
    semestre: Number(datos.semestre),
    anioGrado: datos.anioGrado === '' ? null : Number(datos.anioGrado),
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
    semestre: String(perfil.semestre),
    anioGrado: perfil.anioGrado === null ? '' : String(perfil.anioGrado),
    ciudad: perfil.ciudad,
    intereses: perfil.intereses,
  }
}