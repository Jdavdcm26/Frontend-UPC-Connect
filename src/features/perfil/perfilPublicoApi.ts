import { USAR_FIXTURES } from '@/features/auth/sesionApi'
import { perfilPublicoDesdeServidor, type PerfilPublicoServidor } from '@/features/perfil/conversiones'
import type { PerfilPublico } from '@/features/perfil/tipos'
import { redPerfilDesdeServidor, type RedPerfilServidor } from '@/features/red/conversiones'
import type { RedPerfil } from '@/features/red/tipos'
import { leerPostulacionesDemo } from '@/features/postulaciones/postulacionesDemo'
import { ApiError } from '@/shared/api/apiError'
import { api } from '@/shared/api/client'


const pausa = (ms: number) => new Promise((resolver) => setTimeout(resolver, ms))

// Perfil de prueba con varios datos vacíos: así se ve cómo la pantalla omite lo que no tiene contenido.
const PERFIL_DEMO: PerfilPublicoServidor = {
  id: 'demo-luis',
  slug: 'luis-fernandez',
  nombres: 'Luis',
  apellidos: 'Fernández',
  titular: 'Desarrollador front-end',
  carrera: { id: '00000000-0000-4000-8000-000000000001', nombre: 'Ingeniería de Sistemas' },
  semestre: null,
  anio_grado: 2024,
  ciudad: null,
  descripcion: null,
  intereses: [],
  habilidades: [
    { id: 'demo-react', nombre: 'React', tipo: 'TECNICA', nivel: 'AVANZADO' },
    { id: 'demo-ingles', nombre: 'Inglés', tipo: 'IDIOMA', nivel: 'INTERMEDIO' },
    { id: 'demo-equipo', nombre: 'Trabajo en equipo', tipo: 'BLANDA', nivel: null },
  ],
}

// Con fixtures, se puede abrir el perfil de quien se postuló (guardado en la pestaña) y el de prueba.
function buscarPerfilDemo(slug: string): PerfilPublicoServidor | undefined {
  if (slug === PERFIL_DEMO.slug) return PERFIL_DEMO
  const postulante = leerPostulacionesDemo()
    .map((p) => p.candidato)
    .find((c) => c.slug === slug)
  if (!postulante) return undefined
  return {
    id: postulante.slug,
    slug,
    nombres: postulante.nombres,
    apellidos: postulante.apellidos,
    titular: postulante.titular,
    carrera: { id: '', nombre: postulante.carrera },
    semestre: postulante.semestre,
    anio_grado: postulante.anioGrado,
    ciudad: postulante.ciudad,
    descripcion: postulante.descripcion,
    intereses: postulante.intereses,
    habilidades: [],
  }
}

// Perfil de otra persona con su relación con quien mira: seguidores, si lo sigue y si lo bloqueó.
export type PerfilPublicoConRed = {
  perfil: PerfilPublico
  red: RedPerfil
}

// Perfil de otra persona (HU-27, API-16). Quien puede verlo lo ve completo. Si el slug no existe o
// quien mira no puede verlo, el servidor responde 404 en los dos casos, sin distinguirlos.
// Junto al perfil llega el bloque «red» para los botones de seguir y bloquear (HU-28, HU-31).
export async function obtenerPerfilPublico(slug: string): Promise<PerfilPublicoConRed> {
  if (USAR_FIXTURES) {
    await pausa(400)
    const encontrado = buscarPerfilDemo(slug)
    if (!encontrado) throw new ApiError(404, 'No encontramos ese perfil.')
    return {
      perfil: perfilPublicoDesdeServidor(encontrado),
      red: { usuarioId: encontrado.id, seguidores: 0, seguidos: 0, loSigues: false, loBloqueaste: false },
    }
  }
  const respuesta = await api.get<{ data: PerfilPublicoServidor; red: RedPerfilServidor }>(
    `/api/v1/perfiles/${encodeURIComponent(slug)}`,
  )
  return { perfil: perfilPublicoDesdeServidor(respuesta.data), red: redPerfilDesdeServidor(respuesta.red) }
}
