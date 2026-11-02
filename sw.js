/* Offline cache for the itinerary. Network-first (fresh whenever online), falls back to cache after 3 s or when offline.
   Same-origin GETs only; Google Fonts are not cached, so offline the page uses system fonts.
   Bump CACHE together with TRIP.version in js/data-trip.js on each deploy.

   KILL SWITCH: if a bad worker ever gets stuck on a phone, replace this whole file with the two lines below and push.
   On the next online visit the phone drops its caches and unregisters the worker.
     self.addEventListener('install', () => self.skipWaiting());
     self.addEventListener('activate', e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k)))).then(() => self.registration.unregister())));
*/
const CACHE = 'socal-v1';
const TIMEOUT_MS = 3000;
const ASSETS = [
  './', './index.html', './css/base.css', './css/layout.css', './css/components.css', './css/day.css',
  './js/util.js', './js/icons.js', './js/data-trip.js', './js/data-days.js',
  './js/render-day.js', './js/render-sections.js', './js/render-nav.js', './js/app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const fromCache = req => caches.match(req, { ignoreSearch: true });

function networkFirst(req) {
  return new Promise(resolve => {
    const timer = setTimeout(() => fromCache(req).then(hit => hit && resolve(hit)), TIMEOUT_MS);
    fetch(req.url, { cache: 'no-cache' }).then(res => {
      clearTimeout(timer);
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      resolve(res);
    }).catch(() => {
      clearTimeout(timer);
      fromCache(req).then(hit => resolve(hit || Response.error()));
    });
  });
}

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  e.respondWith(networkFirst(e.request));
});
