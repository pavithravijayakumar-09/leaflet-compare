/*
 * Tiny offline cache for LeafletCheck (UC1: read the leaflet on the way home, even without signal).
 * Network first, fall back to the cached copy. Only files from this app are cached.
 */
const CACHE = 'leafletcheck-v1'

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone()
        caches.open(CACHE).then((cache) => cache.put(request, copy))
        return response
      })
      .catch(() => caches.match(request).then((cached) => cached || caches.match('./'))),
  )
})
