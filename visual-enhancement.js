(() => {
'use strict';
const VERSION='1.16.4';

function cleanAccent(value){
  const m=String(value||'').trim().match(/#([0-9a-f]{6})/i);
  return m?'#'+m[1]:'#e05262';
}
function cardAccent(card){
  const cs=getComputedStyle(card);
  return cleanAccent(cs.getPropertyValue('--light')||cs.getPropertyValue('--shade'));
}
function secondColour(team,accent){
  const s=String(team||'').toLowerCase();
  if(s.includes('mclaren'))return'#111318';
  if(s.includes('ferrari'))return'#ffd447';
  if(s.includes('mercedes'))return'#55e6d2';
  if(s.includes('red bull'))return'#ffd53f';
  if(s.includes('williams'))return'#eaf4ff';
  if(s.includes('aston'))return'#d5ffec';
  if(s.includes('alpine'))return'#ff8fc8';
  if(s.includes('racing bulls')||s.includes('rb'))return'#f7f8fb';
  if(s.includes('haas'))return'#f4f4f4';
  if(s.includes('audi'))return'#e9edf2';
  if(s.includes('cadillac'))return'#d8d8d8';
  return accent;
}

function helmetSvg(accent,number,team=''){
  const n=String(number||'F1');
  const seed=[...n].reduce((a,c)=>a+c.charCodeAt(0),0);
  const secondary=secondColour(team,accent);
  const pattern=seed%4;
  const crown=pattern===0
    ? `<path d="M106 76c52-43 143-52 209-13" fill="none" stroke="${secondary}" stroke-width="19" stroke-linecap="round"/>`
    : pattern===1
    ? `<path d="M145 46l40 91M276 45l-38 92" stroke="${secondary}" stroke-width="13" stroke-linecap="round"/>`
    : pattern===2
    ? `<path d="M103 87c72-26 148-27 218-5" fill="none" stroke="${secondary}" stroke-width="15" stroke-linecap="round"/>`
    : `<path d="M187 36l-11 105M235 35l7 104" stroke="${secondary}" stroke-width="12" stroke-linecap="round"/>`;

  return `<svg viewBox="0 0 440 330" role="img" aria-label="賽車頭盔">
    <defs>
      <linearGradient id="hShell${seed}" x1="0" y1="0" x2=".9" y2="1">
        <stop offset="0" stop-color="#f6f8fb"/>
        <stop offset=".23" stop-color="${accent}"/>
        <stop offset=".78" stop-color="${accent}"/>
        <stop offset="1" stop-color="#0b0e14"/>
      </linearGradient>
      <linearGradient id="hVisor${seed}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#8aa0bb"/>
        <stop offset=".25" stop-color="#34475e"/>
        <stop offset=".58" stop-color="#05080d"/>
        <stop offset="1" stop-color="#1a2534"/>
      </linearGradient>
      <linearGradient id="hGloss${seed}" x1="0" y1="0" x2="1" y2=".4">
        <stop stop-color="#fff" stop-opacity=".55"/>
        <stop offset=".45" stop-color="#fff" stop-opacity=".08"/>
        <stop offset="1" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <g transform="translate(18 4)">
      <ellipse cx="211" cy="300" rx="155" ry="18" fill="#0007"/>
      <path d="M71 180C70 80 117 26 209 24c100-2 157 59 158 158 1 56-24 96-72 126H110c-26-34-40-76-39-128Z"
        fill="url(#hShell${seed})" stroke="#ffffff9f" stroke-width="3"/>
      ${crown}
      <path d="M80 126c87-34 181-35 276 1l-8 70c-100 19-190 18-269-1Z"
        fill="url(#hVisor${seed})" stroke="#dfe8f2" stroke-width="6"/>
      <path d="M94 145c73-22 153-23 239-1" fill="none" stroke="url(#hGloss${seed})" stroke-width="12" stroke-linecap="round"/>
      <path d="M103 213c78 25 158 26 238-1l-20 53c-68 31-137 32-206 2Z"
        fill="#0e131c" stroke="${secondary}" stroke-width="8"/>
      <path d="M91 235c38 11 77 17 118 18" stroke="#ffffff7a" stroke-width="4" stroke-linecap="round"/>
      <circle cx="330" cy="203" r="18" fill="#e9edf3" stroke="#303846" stroke-width="7"/>
      <path d="M116 271h188l-21 29H139Z" fill="#161c26" stroke="${accent}" stroke-width="5"/>
      <text x="211" y="297" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif" font-size="29" font-weight="950">${n}</text>
    </g>
  </svg>`;
}

function carSvg(accent,team=''){
  const secondary=secondColour(team,accent);
  const dark='#0a0d12';
  return `<svg viewBox="0 0 520 300" role="img" aria-label="現代單座賽車">
    <defs>
      <linearGradient id="cBody" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#f7f9fb"/>
        <stop offset=".17" stop-color="${accent}"/>
        <stop offset=".72" stop-color="${accent}"/>
        <stop offset="1" stop-color="#121720"/>
      </linearGradient>
      <linearGradient id="cFloor" x1="0" y1="0" x2="1" y2="0">
        <stop stop-color="#090b10"/><stop offset=".5" stop-color="#1b2029"/><stop offset="1" stop-color="#07090d"/>
      </linearGradient>
    </defs>
    <g transform="translate(7 14)">
      <ellipse cx="258" cy="251" rx="218" ry="20" fill="#0007"/>
      <g>
        <ellipse cx="116" cy="209" rx="43" ry="53" fill="#05070a" stroke="#3e4653" stroke-width="7"/>
        <ellipse cx="116" cy="209" rx="23" ry="31" fill="#12161d"/>
        <ellipse cx="392" cy="209" rx="46" ry="57" fill="#05070a" stroke="#3e4653" stroke-width="7"/>
        <ellipse cx="392" cy="209" rx="25" ry="34" fill="#12161d"/>
      </g>
      <path d="M55 223h112l18 17H46Z" fill="${dark}"/>
      <path d="M342 228h126l-7 20H329Z" fill="${dark}"/>
      <path d="M69 219h95l-9 10H62Z" fill="${secondary}" opacity=".95"/>
      <path d="M359 229h93l-7 9h-91Z" fill="${secondary}" opacity=".9"/>
      <path d="M144 215c31-40 57-67 97-79 31-9 71-8 100 7l52 32-34 39-61 15H169Z"
        fill="url(#cBody)" stroke="#ffffff75" stroke-width="3"/>
      <path d="M170 205c12-42 26-75 45-100 16-20 37-32 62-34l31 7 8 54-39 73Z"
        fill="url(#cBody)" stroke="#ffffff75" stroke-width="3"/>
      <path d="M244 114c18-23 55-26 76-4l13 39c-31 19-67 20-96 2Z"
        fill="#111a27" stroke="#e6edf6" stroke-width="4"/>
      <path d="M258 114c2-30 43-37 55-6" fill="none" stroke="#070a0f" stroke-width="10" stroke-linecap="round"/>
      <path d="M210 165l-48-22-29 27 53 21M335 161l56-21 35 28-59 22"
        fill="${secondary}" stroke="#ffffff55" stroke-width="3"/>
      <path d="M194 214l-24 32h172l22-31" fill="url(#cFloor)" stroke="#303642" stroke-width="3"/>
      <path d="M84 124h98l13 21H78Z" fill="${dark}"/>
      <path d="M91 127h87" stroke="${secondary}" stroke-width="8"/>
      <path d="M355 92h93l10 54-18 4-10-34h-75Z" fill="${dark}"/>
      <path d="M365 99h72" stroke="${secondary}" stroke-width="8"/>
      <path d="M177 207c57 11 122 12 185 0" fill="none" stroke="#ffffff58" stroke-width="4"/>
      <path d="M268 79l-3 37" stroke="#fff" stroke-width="5" opacity=".75"/>
    </g>
  </svg>`;
}

function replaceCardArt(card){
  const art=card.querySelector('.display-art');
  if(!art||art.dataset.ppArt===VERSION)return;
  const type=(card.querySelector('.type')?.textContent||'').toLowerCase();
  const team=(card.querySelector('.tagline')?.textContent||card.querySelector('.surname')?.textContent||'').trim();
  const accent=cardAccent(card);
  if(type.includes('driver')){
    const number=(card.querySelector('.badge-num')?.textContent||'F1').replace('#','').trim();
    art.innerHTML=helmetSvg(accent,number,team);
  }else{
    art.innerHTML=carSvg(accent,team);
  }
  art.dataset.ppArt=VERSION;
}
function replaceProfileArt(root=document){
  root.querySelectorAll('.profile-art:not([data-pp-art])').forEach(art=>{
    const banner=art.closest('.profile-banner');
    if(!banner)return;
    const accent=cleanAccent(getComputedStyle(banner).getPropertyValue('--light')||getComputedStyle(banner).getPropertyValue('--shade'));
    const driver=banner.querySelector('.driver-last');
    if(driver){
      const number=(banner.querySelector('.large-no')?.textContent||'F1').replace('#','').trim();
      const team=banner.querySelector('.team-sub')?.textContent||'';
      art.innerHTML=helmetSvg(accent,number,team);
    }else{
      const team=banner.querySelector('h1')?.textContent||'';
      art.innerHTML=carSvg(accent,team);
    }
    art.dataset.ppArt=VERSION;
  });
}
function applyArt(root=document){
  root.querySelectorAll('.showcase-card').forEach(replaceCardArt);
  replaceProfileArt(root);
}
function watchArt(){
  let pending=false;
  const observer=new MutationObserver(mutations=>{
    if(pending)return;
    if(!mutations.some(m=>m.addedNodes?.length))return;
    pending=true;
    requestAnimationFrame(()=>{
      pending=false;
      applyArt(document);
    });
  });
  observer.observe(document.body,{childList:true,subtree:true});
}
function updateVersion(){
  document.documentElement.dataset.ppVisual=VERSION;
  document.querySelectorAll('.panel.info').forEach(n=>{
    n.innerHTML=n.innerHTML.replace(/Paddock Pulse V1\.\d+(?:\.\d+){1,2}/,'Paddock Pulse V1.16.4');
  });
}
function init(){
  applyArt(document);
  watchArt();
  updateVersion();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})();