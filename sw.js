const CACHE_NAME='ordini-hd-accademia-v60';
const FILES=['./index.html','./style.css?v=60','./v4.css?v=60','./app.js?v=60','./catalog_patch.js?v=60','./danea_patch.js?v=60','./HDNails_Catalogo_Facebook_Commerce.csv?v=60','./app.webmanifest?v=60','./apri.html?v=60','./icon.svg'];
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