const NAME='paddock-pulse-v1-14-2-1-ui-hotfix';
const TRACK_CACHE='paddock-pulse-track-svg-v1';
const CORE=[
  './','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png',
  './assets/las-vegas-1.svg','./assets/lusail-1.svg',
  './ui-refresh.css','./ui-refresh.js'
];
const TRACK_HOSTS=new Set(['cdn.jsdelivr.net','raw.githubusercontent.com']);
const INJECT_HEAD='<link rel="stylesheet" href="./ui-refresh.css?v=1.14.2.1">';
const INJECT_BODY='<script src="./ui-refresh.js?v=1.14.2.1" defer><\\/script>';

function decorateHtml(text){
  let out=text;
  if(!out.includes('ui-refresh.css')) out=out.replace('</head>',INJECT_HEAD+'</head>');
  if(!out.includes('ui-refresh.js')) out=out.replace('</body>',INJECT_BODY+'</body>');
  out=out.replace(/Paddock Pulse V1\.14\.(?:1|2)(?:\.1)?/g,'Paddock Pulse V1.14.2.1');
  out=out.replace(/const APP_VERSION = '1\.14\.(?:1|2)(?:\.1)?';/,"const APP_VERSION = '1.14.2.1';");
  return out;
}

async function htmlResponse(request){
  try{
    const net=await fetch(request,{cache:'no-store'});
    if(!net.ok)throw new Error('HTTP '+net.status);
    const text=decorateHtml(await net.text());
    const response=new Response(text,{
      status:net.status,
      statusText:net.statusText,
      headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-cache'}
    });
    const cache=await caches.open(NAME);
    await cache.put('./index.html',response.clone());
    return response;
  }catch(err){
    const cache=await caches.open(NAME);
    const hit=await cache.match('./index.html')||await caches.match('./index.html');
    if(hit){
      const text=decorateHtml(await hit.text());
      return new Response(text,{headers:{'Content-Type':'text/html; charset=utf-8'}});
    }
    return Response.error();
  }
}

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(NAME).then(c=>c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(k=>k.startsWith('paddock-pulse-')&&k!==NAME&&k!==TRACK_CACHE).map(k=>caches.delete(k))
  )));
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);

  if(TRACK_HOSTS.has(u.hostname)&&u.pathname.includes('/f1-circuits-svg')&&u.pathname.endsWith('.svg')){
    e.respondWith(caches.open(TRACK_CACHE).then(async c=>{
      const hit=await c.match(r);
      if(hit)return hit;
      try{
        const net=await fetch(r);
        if(net.ok||net.type==='opaque')c.put(r,net.clone());
        return net;
      }catch(err){
        return hit||Response.error();
      }
    }));
    return;
  }

  if(u.origin!==self.location.origin)return;

  if(r.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/Paddock-Pulse/')){
    e.respondWith(htmlResponse(r));
    return;
  }

  e.respondWith(
    fetch(r).then(x=>{
      if(x.ok&&u.pathname.match(/\.(?:html|js|css|png|svg|webmanifest)$/)){
        const copy=x.clone();
        caches.open(NAME).then(c=>c.put(r,copy));
      }
      return x;
    }).catch(()=>caches.match(r).then(x=>x||Response.error()))
  );
});
