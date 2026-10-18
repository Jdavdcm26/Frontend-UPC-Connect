// Service worker del shell de UPC Connect (FE-31).
//
// Guarda solo el "cascarón" de la aplicación: la página base y los archivos estáticos
// (JS, CSS, fuentes e íconos). NUNCA toca la API ni las rutas del servidor, así que no
// puede mostrar datos de otra cuenta. Si se pierde la conexión, muestra /offline.html.

const CACHE = 'upc-shell-v1'

// Se guarda al instalar, para que la página sin conexión siempre esté disponible.
const PRECACHE = ['/offline.html', '/offline.css', '/favicon.svg', '/icons/icon-192.png']

// Primer tramo de las rutas que atiende el servidor (API, sesión y paneles): no se tocan.
const RUTAS_DEL_SERVIDOR = ['api', 'sanctum', 'admin', 'livewire', 'filament', 'horizon', 'storage']

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  )
})

// Al activarse, borra las versiones viejas de la caché.
self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nombres) =>
        Promise.all(nombres.filter((n) => n.startsWith('upc-shell-') && n !== CACHE).map((n) => caches.delete(n))),
      )
      .then(() => self.clients.claim()),
  )
})

function esDelServidor(ruta) {
  return RUTAS_DEL_SERVIDOR.includes(ruta.split('/')[1])
}

function esArchivoEstatico(ruta) {
  return ruta.startsWith('/assets/') || ruta.startsWith('/icons/') || PRECACHE.includes(ruta)
}

// Páginas: primero la red (para tener siempre la versión nueva); sin red, la página base
// guardada y, si nunca se guardó, la página sin conexión.
async function pagina(peticion) {
  try {
    const respuesta = await fetch(peticion)
    const tipo = respuesta.headers.get('content-type') ?? ''
    if (respuesta.ok && tipo.includes('text/html')) {
      const cache = await caches.open(CACHE)
      await cache.put('/', respuesta.clone())
    }
    return respuesta
  } catch {
    return (await caches.match('/')) ?? (await caches.match('/offline.html'))
  }
}

// Archivos estáticos: primero la caché (sus nombres cambian con cada versión).
async function archivo(peticion) {
  const guardado = await caches.match(peticion)
  if (guardado) return guardado
  const respuesta = await fetch(peticion)
  if (respuesta.ok) {
    const cache = await caches.open(CACHE)
    await cache.put(peticion, respuesta.clone())
  }
  return respuesta
}

self.addEventListener('fetch', (evento) => {
  const peticion = evento.request
  if (peticion.method !== 'GET') return
  const url = new URL(peticion.url)
  if (url.origin !== self.location.origin || esDelServidor(url.pathname)) return

  if (peticion.mode === 'navigate') {
    evento.respondWith(pagina(peticion))
  } else if (esArchivoEstatico(url.pathname)) {
    evento.respondWith(archivo(peticion))
  }
})
