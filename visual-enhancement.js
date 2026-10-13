(() => {
'use strict';
const VERSION='1.16.3';

/* Track map reliability:
   keep verified slug, but try two independent public repositories before giving up. */
function installTrackSources(){
  const old=window.trackMapStatus;
  if(typeof old!=='function')return;

  window.trackMapStatus=function(race){
    const base=old(race);
    if(!base?.slug)return base;
    const slug=base.slug;

    const urls=[
      `https://raw.githubusercontent.com/f1db/f1db/main/src/assets/circuits/white-outline/${slug}.svg`,
      `https://cdn.jsdelivr.net/gh/f1db/f1db@main/src/assets/circuits/white-outline/${slug}.svg`,
      ...(base.candidates||[])
    ];

    const unique=[...new Set(urls.filter(Boolean))];
    return {...base,url:unique[0]||base.url,candidates:unique};
  };
}

/* More realistic helmet silhouette.
   Still original artwork: no face/photo and no copied official helmet graphic. */
function helmetGraphic(accent,number){
  const n=String(number||'F1');
  const seed=[...n].reduce((a,c)=>a+c.charCodeAt(0),0);
  const flip=seed%2===0;
  const stripe=seed%3;
  return `<svg viewBox="0 0 420 320" role="img" aria-label="賽車頭盔插畫">
    <defs>
      <linearGradient id="pph_shell" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f8fafc"/>
        <stop offset=".22" stop-color="${accent}"/>
        <stop offset=".72" stop-color="${accent}"/>
        <stop offset="1" stop-color="#11151d"/>
      </linearGradient>
      <linearGradient id="pph_visor" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#91a5bf"/><stop offset=".38" stop-color="#263445"/>
        <stop offset=".72" stop-color="#05080d"/><stop offset="1" stop-color="#1b2737"/>
      </linearGradient>
    </defs>
    <g transform="translate(26 8)">
      <ellipse cx="190" cy="288" rx="145" ry="17" fill="#0006"/>
      <path d="M67 177C66 76 118 25 207 25c95 0 146 59 146 157 0 57-26 98-76 122H103c-24-31-36-74-36-127Z"
            fill="url(#pph_shell)" stroke="#ffffffa0" stroke-width="3"/>
      <path d="M76 126c79-32 174-32 266 3l-5 67c-93 17-181 16-260-1Z"
            fill="url(#pph_visor)" stroke="#d7e2ef" stroke-width="6"/>
      <path d="M93 145c69-19 145-20 226 0" fill="none" stroke="#ffffff55" stroke-width="8" stroke-linecap="round"/>
      <path d="M102 214c70 26 142 27 216 1l-17 50c-63 25-126 26-190 2Z"
            fill="#10151e" stroke="${accent}" stroke-width="8"/>
      <path d="M104 72c50-39 122-51 186-25" fill="none" stroke="${accent}" stroke-width="18" stroke-linecap="round"/>
      ${stripe===0?`<path d="M180 31l-8 91" stroke="#fff" stroke-width="10" opacity=".78"/>`:
        stripe===1?`<path d="M133 48l44 78M262 43l-38 82" stroke="#fff" stroke-width="9" opacity=".7"/>`:
        `<path d="M117 84c56-29 116-32 177-8" stroke="#fff" stroke-width="10" opacity=".72"/>`}
      <path d="M85 ${flip?235:247}c78 20 157 20 238-2" fill="none" stroke="#ffffff77" stroke-width="5"/>
      <circle cx="318" cy="204" r="17" fill="#e9edf3" stroke="#303846" stroke-width="7"/>
      <text x="202" y="288" text-anchor="middle" font-family="system-ui,sans-serif"
            font-size="38" font-weight="950" fill="#fff">${n}</text>
    </g>
  </svg>`;
}

/* Modern single-seater proportions: wide front wing, exposed tyres,
   narrow nose, sidepods, halo/cockpit, rear wing. */
function carGraphic(accent){
  return `<svg viewBox="0 0 440 320" role="img" aria-label="現代單座賽車插畫">
    <defs>
      <linearGradient id="ppc_body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f8fafc"/>
        <stop offset=".20" stop-color="${accent}"/>
        <stop offset=".68" stop-color="${accent}"/>
        <stop offset="1" stop-color="#11151d"/>
      </linearGradient>
    </defs>
    <g transform="translate(12 5)">
      <ellipse cx="210" cy="278" rx="165" ry="19" fill="#0006"/>
      <rect x="87" y="42" width="248" height="18" rx="5" fill="#0a0d12"/>
      <path d="M109 48h204l-13 24H122Z" fill="${accent}" opacity=".9"/>
      <rect x="69" y="210" width="284" height="26" rx="7" fill="#090c11"/>
      <path d="M92 215h238l-18 19H109Z" fill="${accent}" opacity=".8"/>
      <rect x="60" y="82" width="54" height="78" rx="13" fill="#07090d" stroke="#566070" stroke-width="5"/>
      <rect x="306" y="82" width="54" height="78" rx="13" fill="#07090d" stroke="#566070" stroke-width="5"/>
      <rect x="54" y="181" width="62" height="87" rx="14" fill="#07090d" stroke="#566070" stroke-width="5"/>
      <rect x="304" y="181" width="62" height="87" rx="14" fill="#07090d" stroke="#566070" stroke-width="5"/>
      <path d="M193 38h31l17 65 36 50-24 43 22 55-28 40h-77l-28-40 22-55-24-43 36-50Z"
            fill="url(#ppc_body)" stroke="#ffffff88" stroke-width="4"/>
      <path d="M171 122c26-29 70-29 96 0l8 47c-43 23-83 24-121 0Z"
            fill="#111a27" stroke="#e8edf4" stroke-width="5"/>
      <path d="M184 118c5-35 50-35 56 0" fill="none" stroke="#0a0e15" stroke-width="11" stroke-linecap="round"/>
      <path d="M148 146l-43 26 54 17M275 146l43 26-54 17" fill="${accent}" stroke="#ffffff66" stroke-width="3"/>
      <path d="M184 199h56l20 31h-96Z" fill="#0e131b"/>
      <path d="M181 245h61" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      <path d="M202 62h14v55h-14Z" fill="#ffffffb5"/>
    </g>
  </svg>`;
}

function installVisualOverrides(){
  if(typeof window.helmetArt==='function')window.helmetArt=helmetGraphic;
  if(typeof window.carArt==='function')window.carArt=carGraphic;

  /* Refresh cards that were rendered before this additive layer loaded. */
  try{window.renderStandings?.()}catch{}
  try{window.renderHomeGarage?.()}catch{}
  try{
    if(window.state?.favoriteDrivers||window.state?.favoriteTeams)window.renderFavoriteHub?.();
  }catch{}
  try{
    if(window.state?.activeDetail){
      const t=window.state.activeDetail.type;
      const list=window.state[t==='driver'?'drivers':'constructors']||[];
      const item=list.find(x=>(t==='driver'?window.driverIdOf?.(x):window.constructorIdOf?.(x))===window.state.activeDetail.id);
      if(item)window.renderDetail?.(item,t);
    }
  }catch{}
}

function updateVersion(){
  document.documentElement.dataset.ppVisual=VERSION;
  document.querySelectorAll('.panel.info').forEach(n=>{
    n.innerHTML=n.innerHTML.replace(/Paddock Pulse V1\.\d+(?:\.\d+){1,2}/,'Paddock Pulse V1.16.3');
  });
}

function init(){
  installTrackSources();
  installVisualOverrides();
  updateVersion();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();