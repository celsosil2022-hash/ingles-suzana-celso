const CACHE='isc-v2';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const isPage=e.request.mode==='navigate'||e.request.url.endsWith('/index.html');
  if(isPage){
    e.respondWith(fetch(e.request).then(res=>{const cp=res.clone();caches.open(CACHE).then(c=>c.put('./index.html',cp));return res}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(res.ok&&(e.request.url.startsWith(self.location.origin)||e.request.url.includes('fonts.g'))){const cp=res.clone();caches.open(CACHE).then(c=>c.put(e.request,cp))}
    return res})));
});
