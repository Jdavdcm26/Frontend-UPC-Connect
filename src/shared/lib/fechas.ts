// Fecha de hoy según la hora del computador, en formato AAAA-MM-DD.
// Se usa la hora local y no la UTC: en Colombia, a las 8 p. m. la hora UTC ya es «mañana».
export function hoyLocal(): string {
  const ahora = new Date()
  const mes = String(ahora.getMonth() + 1).padStart(2, '0')
  const dia = String(ahora.getDate()).padStart(2, '0')
  return `${ahora.getFullYear()}-${mes}-${dia}`
}

// Fecha para mostrar (por ejemplo, «17 de octubre de 2026») a partir de una fecha y hora ISO.
export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}