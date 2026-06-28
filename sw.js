const CACHE_NAME = 'hd-ordini-v2';
const FILES = [
  './',
  './index.html',
  './ORDINIACCADEMIA_descrizioni.html',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => caches.match('./ORDINIACCADEMIA_descrizioni.html'));
    })
  );
});