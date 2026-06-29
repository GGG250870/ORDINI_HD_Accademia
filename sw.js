const CACHE_NAME='ordini-hd-accademia-v8';
const FILES=['./','./index.html?v=6','./style.css?v=6','./v4.css?v=6','./app.js?v=6','./prodotti.json?v=6','./app.webmanifest?v=6','./icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(FILES)).catch(()=>null));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(fetch(e.request).then(r=>{let copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy)).catch(()=>{});return r;}).catch(()=>caches.match(e.request).then(c=>c||caches.match('./index.html?v=6'))));});