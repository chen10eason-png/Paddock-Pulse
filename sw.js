const CACHE = 'paddock-pulse-v1-3-0';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => {e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate', e => {e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch', e => {
  if(e.request.method!=='GET')return;
  const url = new URL(e.request.url);
  // Never cache standings, race results, or any remote request; localStorage handles last known data.
  if(url.origin !== self.location.origin)return;
  e.respondWith(fetch(e.request).then(response=>{
    if(response.ok){const copy=response.clone();e.waitUntil(caches.open(CACHE).then(cache=>cache.put(e.request,copy)));}
    return response;
  }).catch(()=>caches.match(e.request).then(cached=>cached||caches.match('./index.html'))));
});
