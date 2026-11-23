const CACHE_NAME='ordini-hd-accademia-v51';
const FILES=['./style.css?v=51','./v4.css?v=51','./app.js?v=51','./catalog_patch.js?v=51','./danea_patch.js?v=51','./HDNails_Catalogo_Facebook_Commerce.csv?v=51','./app.webmanifest?v=51','./apri.html?v=51','./icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(FILES)).catch(()=>null));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-store'}).catch(()=>caches.match('./index.html?v=51')));
    return;
  }
  e.respondWith(fetch(e.request).then(r=>{let copy=r.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,copy)).catch(()=>{});return r;}).catch(()=>caches.match(e.request)));
});