// Registra el service worker que guarda el shell de la app (FE-31).
// Solo en producción: en desarrollo la caché estorbaría al ver los cambios.
export function registrarServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Si falla, la app sigue funcionando igual, solo que sin instalación ni página sin conexión.
    })
  })
}
