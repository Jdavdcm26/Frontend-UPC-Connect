// Aviso para la empresa que todavía no fue aprobada: puede entrar, pero no publicar (RF-42).
export default function ApprovalBanner() {
  return (
    <div role="status" className="rounded-lg border bg-muted p-4 text-sm">
      <p className="font-semibold">Tu empresa aún no ha sido aprobada</p>
      <p className="text-muted-foreground">
        Mientras la administración de la UPC la revisa, todavía no puedes publicar vacantes.
      </p>
    </div>
  )
}
