// Iniciales para el avatar. La cuenta solo trae el correo (no el nombre), así que se sacan de ahí:
// "jose.castro@..." -> "JC"; "ana@..." -> "AN".
export function iniciales(correo: string): string {
  const antesDeLaArroba = correo.split('@')[0] ?? ''
  const partes = antesDeLaArroba.split(/[._+-]+/).filter(Boolean)
  const primera = partes[0] ?? ''
  const segunda = partes[1] ?? ''
  const texto = segunda ? primera[0] + segunda[0] : primera.slice(0, 2)
  return texto ? texto.toUpperCase() : '?'
}

// Iniciales de una persona a partir de su nombre: «Ana María» + «Pérez Gómez» -> «AP».
export function inicialesDeNombre(nombres: string, apellidos: string): string {
  const primera = nombres.trim()[0] ?? ''
  const segunda = apellidos.trim()[0] ?? ''
  const texto = primera + segunda
  return texto ? texto.toLocaleUpperCase('es-CO') : '?'
}
