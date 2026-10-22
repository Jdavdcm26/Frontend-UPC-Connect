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

// Fecha y hora para mostrar (por ejemplo, «17 de octubre de 2026 a las 3:00 p. m.») a partir de una fecha y hora ISO.
export function formatearFechaHora(iso: string): string {
  return new Date(iso).toLocaleString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// Día para mostrar (por ejemplo, «17 de octubre de 2026») a partir de una fecha AAAA-MM-DD.
// Se arma con la hora local: new Date('2026-10-17') la tomaría como UTC y en Colombia mostraría el día anterior.
export function formatearDia(fecha: string): string {
  const [anio, mes, dia] = fecha.split('-').map(Number)
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
}
