const NAME='paddock-pulse-v1-15-0-dashboard-ux';
const TRACK_CACHE='paddock-pulse-track-svg-v1';
const CORE=[
  './','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png',
  './assets/las-vegas-1.svg','./assets/lusail-1.svg',
  './ui-refresh.css','./ui-refresh.js','./v115.css'
];
const TRACK_HOSTS=new Set(['cdn.jsdelivr.net','raw.githubusercontent.com']);
const INJECT_HEAD=
  '<link rel="stylesheet" href="./ui-refresh.css?v=1.15.0">'+
  '<link rel="stylesheet" href="./v115.css?v=1.15.0">';
const INJECT_BODY='<script src="./ui-refresh.js?v=1.15.0" defer></script>';

function decorateHtml(text){
  let out=text;
  if(!out.includes('ui-refresh.css'))out=out.replace('</head>',INJECT_HEAD+'</head>');
  else if(!out.includes('v115.css'))out=out.replace('</head>','<link rel="stylesheet" href="./v115.css?v=1.15.0"></head>');
  if(!out.includes('ui-refresh.js'))out=out.replace('</body>',INJECT_BODY+'</body>');

  out=out.replace(
    /Paddock Pulse V1\.\d+(?:\.\d+){1,2}/g,
    'Paddock Pulse V1.15.0'
  );
  out=out.replace(
    /const APP_VERSION = '[^']+';/,
    "const APP_VERSION = '1.15.0';"
  );
  return out;
}

async function htmlResponse(request){
  try{
    const net=await fetch(request,{cache:'no-store'});
    if(!net.ok)throw Error('HTTP '+net.status);

    const text=decorateHtml(await net.text());
    const response=new Response(text,{
      status:net.status,
      statusText:net.statusText,
      headers:{
        'Content-Type':'text/html; charset=utf-8',
        'Cache-Control':'no-cache'
      }
    });

    const cache=await caches.open(NAME);
    await cache.put('./index.html',response.clone());
    return response;
  }catch(err){
    const cache=await caches.open(NAME);
    const hit=await cache.match('./index.html')||await caches.match('./index.html');
    if(hit){
      return new Response(
        decorateHtml(await hit.text()),
        {headers:{'Content-Type':'text/html; charset=utf-8'}}
      );
    }
    return Response.error();
  }
}

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(NAME).then(cache=>cache.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys
        .filter(key=>key.startsWith('paddock-pulse-')&&key!==NAME&&key!==TRACK_CACHE)
        .map(key=>caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);

  if(TRACK_HOSTS.has(url.hostname)&&
     url.pathname.includes('/f1-circuits-svg')&&
     url.pathname.endsWith('.svg')){
    event.respondWith(
      caches.open(TRACK_CACHE).then(async cache=>{
        const hit=await cache.match(request);
        if(hit)return hit;
        try{
          const net=await fetch(request);
          if(net.ok||net.type==='opaque')cache.put(request,net.clone());
          return net;
        }catch(err){
          return hit||Response.error();
        }
      })
    );
    return;
  }

  if(url.origin!==self.location.origin)return;

  if(request.mode==='navigate'||
     url.pathname.endsWith('/index.html')||
     url.pathname.endsWith('/Paddock-Pulse/')){
    event.respondWith(htmlResponse(request));
    return;
  }

  event.respondWith(
    fetch(request).then(response=>{
      if(response.ok&&url.pathname.match(/\.(?:html|js|css|png|svg|webmanifest)$/)){
        const copy=response.clone();
        caches.open(NAME).then(cache=>cache.put(request,copy));
      }
      return response;
    }).catch(()=>caches.match(request).then(hit=>hit||Response.error()))
  );
});