import { VERSION_POLITICA } from '@/features/auth/politica'
import AvisoInformativo from '@/shared/ui/AvisoInformativo'

// Política de privacidad vigente (HU-07 / FE-14).
// El texto es provisional: falta el texto oficial de la UPC.
export default function PoliticaPrivacidadPage() {
  return (
    <article className="mx-auto max-w-2xl space-y-6 rounded-xl border bg-card p-5 shadow-sm sm:p-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">Política de privacidad</h1>
        <p className="text-sm text-muted-foreground">Versión {VERSION_POLITICA}</p>
      </header>
      <AvisoInformativo>
        Texto provisional. El texto oficial de la política de tratamiento de datos de UPC Connect
        se publicará aquí antes de abrir la plataforma al público.
      </AvisoInformativo>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Qué datos recogemos</h2>
        <p className="text-muted-foreground">
          Tu correo institucional y los datos de tu perfil profesional que decidas completar.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Para qué los usamos</h2>
        <p className="text-muted-foreground">
          Para crear tu cuenta, conectar estudiantes y egresados con empresas, y enviarte avisos
          sobre tus postulaciones.
        </p>
      </section>
    </article>
  )
}
