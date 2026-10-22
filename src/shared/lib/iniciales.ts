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
