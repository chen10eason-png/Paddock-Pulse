const NAME='paddock-pulse-v1-14-0';
const TRACK_CACHE='paddock-pulse-track-svg-v1';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./assets/las-vegas-1.svg','./las-vegas-1.svg'];
const TRACK_HOSTS=new Set(['cdn.jsdelivr.net','raw.githubusercontent.com']);
self.addEventListener('install',e=>{e.waitUntil(caches.open(NAME).then(c=>c.addAll(CORE)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('paddock-pulse-')&&k!==NAME&&k!==TRACK_CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(TRACK_HOSTS.has(u.hostname)&&u.pathname.includes('/f1-circuits-svg')&&u.pathname.endsWith('.svg')){
    e.respondWith(caches.open(TRACK_CACHE).then(async c=>{const hit=await c.match(r);if(hit)return hit;try{const net=await fetch(r);if(net.ok||net.type==='opaque')c.put(r,net.clone());return net}catch(err){return hit||Response.error()}}));return;
  }
  if(u.origin!==self.location.origin)return;
  e.respondWith(fetch(r).then(x=>{if(x.ok&&u.pathname.match(/\.(?:html|js|png|svg|webmanifest)$/)){const copy=x.clone();caches.open(NAME).then(c=>c.put(r,copy))}return x}).catch(()=>caches.match(r).then(x=>x||(r.mode==='navigate'?caches.match('./index.html'):Response.error()))))
});
