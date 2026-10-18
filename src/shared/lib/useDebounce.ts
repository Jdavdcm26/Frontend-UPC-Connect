import { useEffect, useState } from 'react'

// Devuelve el valor con un retraso: solo cambia cuando deja de cambiar durante «ms» milisegundos.
// Sirve para no llamar a la API en cada tecla.
export function useDebounce<T>(valor: T, ms = 250): T {
  const [retrasado, setRetrasado] = useState(valor)

  useEffect(() => {
    const temporizador = setTimeout(() => setRetrasado(valor), ms)
    return () => clearTimeout(temporizador)
  }, [valor, ms])

  return retrasado
}
