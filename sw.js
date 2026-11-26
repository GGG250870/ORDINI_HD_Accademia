const CACHE_NAME='ordini-hd-accademia-v59';
const FILES=['./index.html','./style.css?v=59','./v4.css?v=59','./app.js?v=59','./catalog_patch.js?v=59','./danea_patch.js?v=59','./HDNails_Catalogo_Facebook_Commerce.csv?v=59','./app.webmanifest?v=59','./apri.html?v=59','./icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>Promise.allSettled(FILES.map(file=>c.add(file)))).catch(()=>null));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ordini-hd-accademia-')&&k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(fetch(e.request).then(r=>{if(!r.ok)return r;let copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy)).catch(()=>{});return r;}).catch(()=>caches.match(e.request)));
});