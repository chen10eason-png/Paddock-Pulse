(() => {
'use strict';
const VERSION='1.16.4', RELAY='https://paddock-pulse-live.onrender.com';
const LIVE_POLL_MS=5000,RACE_POLL_MS=3000,STALE_POLL_MS=8000,IDLE_POLL_MS=20000,REQUEST_TIMEOUT_MS=12000;
let latest=null,gapMode='gap',pollTimer=null,requestInFlight=false,requestSeq=0,active=false,liveMode='latest',meetings=[],clockAnchor=null,lastClockFingerprint='',lastClockSessionKey='',lastQualPhase=1,lastQualSessionKey='';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function injectStyles(){if(document.getElementById('ppNativeLiveStyle'))return;const s=document.createElement('style');s.id='ppNativeLiveStyle';s.textContent=`
.bottom{grid-template-columns:repeat(6,minmax(0,1fr))!important}.bottom .glass-lens{left:calc(6px + (100% - 12px) * var(--active-index) / 6)!important;width:calc((100% - 12px) / 6)!important}
.pp-live-mode{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin:13px 0 15px;padding:4px;border:1px solid #ffffff14;border-radius:15px;background:#11151d}.pp-live-mode button{border:0;border-radius:11px;padding:10px;color:#8f99aa;background:transparent;font-size:11px;font-weight:850}.pp-live-mode button.active{background:linear-gradient(135deg,#582832,#251923);color:#fff;box-shadow:inset 0 0 0 1px #ffffff10}.pp-live-history{display:none;margin:-5px 0 15px}.pp-live-history.show{display:grid;grid-template-columns:1fr 1fr;gap:8px}.pp-live-history select{width:100%;min-width:0;border:1px solid #ffffff18;border-radius:12px;background:#151b25;color:#eef2f7;padding:10px;font:inherit;font-size:11px}
.pp-live-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.pp-live-status{border:1px solid #ffffff1c;border-radius:99px;padding:7px 10px;font-size:9px;font-weight:900;background:#202631}.pp-live-status.live{background:#421518;color:#ff817a}.pp-live-status.final,.pp-live-status.result{background:#172737;color:#a7d8ff}.pp-live-status.stale,.pp-live-status.connecting{background:#31281a;color:#e3c486}
.pp-live-hero{margin-top:18px;padding:18px;border:1px solid #ffffff1c;border-radius:23px;background:radial-gradient(ellipse at 100% 0,#ff53611f,transparent 50%),linear-gradient(155deg,#1a202c,#0d121b)}.pp-live-event{font-size:22px;font-weight:950;margin-top:5px}.pp-live-meta{margin-top:5px;color:#929dae;font-size:11px}
.pp-live-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:15px}.pp-live-metric,.pp-live-weather{border:1px solid #ffffff14;border-radius:15px;padding:11px;background:#ffffff08}.pp-live-metric small,.pp-live-weather small{display:block;color:#7f899a;font-size:7.5px;font-weight:900;letter-spacing:1px}.pp-live-metric strong{display:block;margin-top:5px;font-size:19px}.pp-live-metric.warning{background:#211d0e;border-color:#6c5b1f}.pp-live-metric.red{background:#241114;border-color:#74282d}.pp-live-weather-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px}.pp-live-weather strong{display:block;margin-top:5px;font-size:12px}
.pp-live-toolbar{display:flex;justify-content:space-between;align-items:center;margin:23px 0 10px}.pp-live-toolbar h2{margin:0;font-size:17px}.pp-live-seg{display:flex;padding:3px;background:#11151d;border:1px solid #242a35;border-radius:11px}.pp-live-seg button{border:0;background:transparent;color:#7f8999;padding:5px 10px;border-radius:8px;font-size:10px;font-weight:800}.pp-live-seg button.active{background:#252b36;color:#fff}
.pp-live-drivers{display:flex;flex-direction:column;gap:7px}.pp-live-driver{position:relative;display:grid;grid-template-columns:34px minmax(0,1fr) auto;align-items:center;gap:10px;background:linear-gradient(180deg,#171d28,#0f141d);border:1px solid #ffffff17;border-radius:16px;padding:11px 12px 11px 15px;overflow:hidden}.pp-live-driver:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--team,#777)}.pp-live-driver.retired{opacity:.56}.pp-live-pos{font-size:18px;font-weight:950}.pp-live-name{font-size:13px;font-weight:850}.pp-live-team,.pp-live-detail{font-size:10px;color:#8f99aa;margin-top:3px}.pp-live-right{text-align:right;min-width:105px}.pp-live-gap,.pp-live-best{font-weight:900;font-size:12px}.pp-live-pit{color:var(--team,#aaa)!important}.pp-live-pill{display:inline-flex;margin-left:5px;padding:2px 5px;border-radius:7px;font-size:8px;font-weight:900}.pp-live-pill.dnf{background:#3a2224;color:#ff9a94}.pp-live-pill.dns{background:#30291a;color:#ffd77a}.pp-live-pill.dsq{background:#3b2137;color:#ff9ce8}.pp-live-pill.nc{background:#262b33;color:#b8c0cc}.pp-live-pill.fast{background:#321a42;color:#d9a0ff}
.pp-live-tyre{display:inline-flex;align-items:center;justify-content:center;width:19px;height:19px;margin-left:6px;border-radius:50%;font-size:10px;font-weight:950}.pp-live-tyre.soft{background:#ff3545}.pp-live-tyre.medium{background:#ffd21e;color:#111}.pp-live-tyre.hard{background:#f4f6f8;color:#111}.pp-live-tyre.intermediate{background:#36c768}.pp-live-tyre.wet{background:#3494ff}.pp-live-cheq{display:inline-block;width:16px;height:12px;margin-left:7px;background:conic-gradient(#fff 25%,#111 0 50%,#fff 0 75%,#111 0) 0 0/8px 8px;border:1px solid #dfe3e8}.pp-live-qparts{font-size:9px;color:#9ba4b4;margin-top:4px}
.pp-live-rc{display:flex;flex-direction:column;gap:7px}.pp-live-msg,.pp-live-empty{background:#11151d;border:1px solid #ffffff14;border-radius:14px;padding:11px 12px}.pp-live-empty{text-align:center;color:#929daf;padding:24px}.pp-live-footer{text-align:center;color:#697284;font-size:9px;margin:16px 0}
@media(max-width:560px){.pp-live-metrics{grid-template-columns:1fr 1fr}.pp-live-metric.clock{grid-column:1/-1}.pp-live-weather-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:390px){.bottom .glass-lens{left:calc(5px + (100% - 10px) * var(--active-index) / 6)!important;width:calc((100% - 10px) / 6)!important}.bottom .nav{font-size:9px!important}.pp-live-driver{grid-template-columns:30px minmax(0,1fr) auto}.pp-live-right{min-width:92px}}`;document.head.appendChild(s)}
function icon(){return `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4"/><path d="M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 4.6a10.5 10.5 0 0 1 0 14.8"/></svg>`}
function installNav(){const d=document.querySelector('.bottom');if(!d||d.querySelector('[data-go="live"]'))return;const b=document.createElement('button');b.className='nav';b.dataset.go='live';b.innerHTML=`<i>${icon()}</i><span>Live</span>`;const s=d.querySelector('[data-go="standings"]');s?d.insertBefore(b,s):d.appendChild(b)}
function installView(){document.getElementById('live')?.remove();const m=document.querySelector('main.app');if(!m)return;const s=document.createElement('section');s.id='live';s.className='view hidden';s.innerHTML=`<div class="pp-live-head"><div><div class="eyebrow">LIVE TIMING</div><h1 class="page-title">Race live<span style="color:#ff535b">.</span></h1><p class="muted">Paddock Pulse Live relay · 原生介面</p></div><span id="ppLiveStatus" class="pp-live-status">LOADING</span></div><div class="pp-live-mode"><button class="active" data-pp-live-tab="latest">最新狀態</button><button data-pp-live-tab="history">歷史結果</button></div><div id="ppLiveHistory" class="pp-live-history"><select id="ppLiveMeeting"><option>載入賽事…</option></select><select id="ppLiveSession"><option>選擇 Session</option></select></div><section class="pp-live-hero"><div class="pp-hub-kicker" id="ppLiveEyebrow">WAITING FOR RELAY</div><div id="ppLiveEvent" class="pp-live-event">等待資料…</div><div id="ppLiveMeta" class="pp-live-meta">正在連線</div><div class="pp-live-metrics"><div class="pp-live-metric"><small>LAP</small><strong id="ppLiveLap">—</strong></div><div id="ppLiveTrackMetric" class="pp-live-metric"><small>TRACK</small><strong id="ppLiveTrack">—</strong></div><div class="pp-live-metric clock"><small>SESSION CLOCK</small><strong id="ppLiveClock">—</strong></div></div><div class="pp-live-weather-grid"><div class="pp-live-weather"><small>AIR</small><strong id="ppLiveAir">—</strong></div><div class="pp-live-weather"><small>TRACK TEMP</small><strong id="ppLiveTrackTemp">—</strong></div><div class="pp-live-weather"><small>HUMIDITY</small><strong id="ppLiveHumidity">—</strong></div><div class="pp-live-weather"><small>WIND</small><strong id="ppLiveWind">—</strong></div></div></section><div class="pp-live-toolbar"><h2 id="ppLiveTowerTitle">Timing Tower</h2><div id="ppLiveGapToggle" class="pp-live-seg"><button class="active" data-pp-live-mode="gap">GAP</button><button data-pp-live-mode="interval">INTERVAL</button></div></div><div id="ppLiveDrivers" class="pp-live-drivers"><div class="pp-live-empty">等待 Live Timing…</div></div><div class="pp-live-toolbar"><h2>Race Control</h2></div><div id="ppLiveRaceControl" class="pp-live-rc"><div class="pp-live-empty">目前沒有訊息</div></div><div id="ppLiveUpdated" class="pp-live-footer">—</div>`;m.appendChild(s)}
const e=id=>document.getElementById(id);
function status(v){const n=e('ppLiveStatus');if(!n)return;const s=String(v||'WAITING').toUpperCase();n.textContent=s;n.className='pp-live-status '+s.toLowerCase()}
function kind(d){const s=((d?.session?.Name||'')+' '+(d?.session?.Type||'')).toLowerCase();if(s.includes('qualifying'))return'qualifying';if(s.includes('practice'))return'practice';if(s.includes('race')||s.includes('sprint'))return'race';return'other'}
function skey(d){const m=d?.session?.Meeting||{};return [m.Key||m.Name||'',d?.session?.Key||d?.session?.Name||'',kind(d)].join('|')}
function qphase(d){if(kind(d)!=='qualifying')return null;const k=skey(d);if(k!==lastQualSessionKey){lastQualSessionKey=k;lastQualPhase=1}const x=Number(d?.qualifyingStage);if(x>=1&&x<=3)return lastQualPhase=x;let z=0;for(const r of d?.drivers||[])z=Math.max(z,(r.qualTimes||[]).filter(Boolean).length);if(z)lastQualPhase=Math.min(3,z);return lastQualPhase}
function qlabel(d){const p=qphase(d);return p?((/sprint/i.test((d?.session?.Name||'')+' '+(d?.session?.Type||''))?'SQ':'Q')+p):''}
function pcs(v){if(v==null||v==='')return null;const p=String(v).split(':').map(Number);if(p.some(x=>!Number.isFinite(x)))return null;return p.length===3?p[0]*3600+p[1]*60+p[2]:p.length===2?p[0]*60+p[1]:p[0]}
function fcs(t){if(!Number.isFinite(t))return'—';t=Math.max(0,Math.floor(t));const h=Math.floor(t/3600),m=Math.floor(t%3600/60),s=t%60;return h?[h,m,s].map(x=>String(x).padStart(2,'0')).join(':'):[m,s].map(x=>String(x).padStart(2,'0')).join(':')}
function setClock(d){const sec=pcs(d?.clock?.Remaining),k=skey(d);if(sec==null){clockAnchor=null;return}const utc=Date.parse(d?.clock?.Utc||'');const fp=String(d.clock.Remaining)+'|'+utc,run=d?.source==='live'&&sec>0&&String(d?.clock?.Extrapolating).toLowerCase()!=='false';if(clockAnchor&&k===lastClockSessionKey&&fp===lastClockFingerprint){clockAnchor.running=run;return}let eff=sec,now=Date.now();if(run&&Number.isFinite(utc))eff=Math.max(0,sec-Math.max(0,(now-utc)/1000));clockAnchor={seconds:eff,at:now,running:run};lastClockSessionKey=k;lastClockFingerprint=fp}
function tick(){if(!latest||!e('ppLiveClock'))return;if(!clockAnchor)e('ppLiveClock').textContent=latest?.clock?.Remaining||'—';else e('ppLiveClock').textContent=fcs(clockAnchor.seconds-(clockAnchor.running?Math.floor((Date.now()-clockAnchor.at)/1000):0))}
function tyreClass(c){c=String(c||'').toUpperCase();return c==='SOFT'?'soft':c==='MEDIUM'?'medium':c==='HARD'?'hard':c==='INTERMEDIATE'?'intermediate':c==='WET'?'wet':''}
function tyre(d,x){let c=(kind(d)==='practice'||kind(d)==='qualifying')&&(d.source==='archive'||['FINAL','RESULT'].includes(String(d.status).toUpperCase()))?(x.bestLapCompound||''):(x.compound||'');const map={SOFT:'S',MEDIUM:'M',HARD:'H',INTERMEDIATE:'I',WET:'W'},l=map[String(c).toUpperCase()];return l?`<span class="pp-live-tyre ${tyreClass(c)}">${l}</span>`:''}
function ls(v){if(!v)return Infinity;const p=String(v).split(':');return p.length===2?Number(p[0])*60+Number(p[1]):Number(v)||Infinity}
function best(ds){let n=null,t=Infinity;for(const d of ds||[]){const x=ls(d.bestLap);if(x<t){n=d.number;t=x}}return{n,t}}
function render(d){latest=d;status(d.status);const m=d.session?.Meeting||{},ph=qlabel(d),k=kind(d),sa=k==='practice'||k==='qualifying',ds=d.drivers||[],b=best(ds);e('ppLiveEyebrow').textContent=d.source==='archive'?'LATEST / ARCHIVE RESULT':'LIVE TIMING';e('ppLiveEvent').textContent=m.Name||'F1 Session';e('ppLiveMeta').textContent=[m.Location,d.session?.Name,ph,d.sessionStatus].filter(Boolean).join(' · ');e('ppLiveLap').textContent=(d.lap?.CurrentLap||'—')+' / '+(d.lap?.TotalLaps||'—');const tc=String(d.track?.Status||''),tm=String(d.track?.Message||''),ts=tc==='4'?['SC','warning']:tc==='6'?['VSC','warning']:tc==='7'?['VSC ENDING','warning']:tc==='5'?['RED FLAG','red']:tc==='2'?[tm||'YELLOW','warning']:[tm||tc||'—',''];e('ppLiveTrack').textContent=ts[0];e('ppLiveTrackMetric').className='pp-live-metric '+ts[1];setClock(d);tick();e('ppLiveAir').textContent=d.weather?.AirTemp?d.weather.AirTemp+'°C':'—';e('ppLiveTrackTemp').textContent=d.weather?.TrackTemp?d.weather.TrackTemp+'°C':'—';e('ppLiveHumidity').textContent=d.weather?.Humidity?d.weather.Humidity+'%':'—';e('ppLiveWind').textContent=d.weather?.WindSpeed?d.weather.WindSpeed+' m/s':'—';e('ppLiveTowerTitle').textContent=sa?(k==='qualifying'?'Qualifying Times · '+ph:'Practice Times'):'Timing Tower';e('ppLiveGapToggle').style.display=sa?'none':'flex';e('ppLiveDrivers').innerHTML=ds.map(x=>{const lab=x.classificationLabel||(x.dnf?'DNF':''),cl=lab==='DNS'?'dns':lab==='DSQ'?'dsq':lab==='NC'?'nc':'dnf',st=lab?`<span class="pp-live-pill ${cl}">${esc(lab)}</span>`:'',fast=String(x.number)===String(b.n)&&x.bestLap?'<span class="pp-live-pill fast">FASTEST</span>':'',dim=lab?' retired':'';let r='',q='';if(sa){const sec=ls(x.bestLap),g=x.statsGap||(Number.isFinite(sec)&&Number.isFinite(b.t)?(sec-b.t<.0005?'FASTEST':'+'+(sec-b.t).toFixed(3)):'—');r=`<div class="pp-live-best">${esc(x.bestLap||'—')}${tyre(d,x)}</div><div class="pp-live-detail">GAP ${esc(g)}</div>`;if(k==='qualifying'&&(x.qualTimes||[]).length)q=`<div class="pp-live-qparts">${x.qualTimes.map((v,i)=>'Q'+(i+1)+' '+esc(v)).join(' · ')}</div>`}else{const v=gapMode==='interval'?(Number(x.position)===1?'LEADER':x.interval||'—'):(Number(x.position)===1?'LEADER':x.gap||'—');r=x.inPit?`<div class="pp-live-gap pp-live-pit">IN PIT${tyre(d,x)}</div>`:`<div class="pp-live-gap">${esc(v)}${tyre(d,x)}</div>`;r+=`<div class="pp-live-detail">${x.lastLap?'LAST '+esc(x.lastLap):'LAST —'}${x.bestLap?' · BEST '+esc(x.bestLap):''}</div>`}return `<div class="pp-live-driver${dim}" style="--team:#${esc(x.teamColour||'777777')}"><div class="pp-live-pos">${esc(x.position)}</div><div><div class="pp-live-name">${esc(x.tla||x.name||x.number)} #${esc(x.number)}${x.chequered?'<span class="pp-live-cheq"></span>':''}${st}${fast}</div><div class="pp-live-team">${esc(x.team)}${sa&&x.laps!=null?' · '+esc(x.laps)+' LAPS':''}</div>${q}</div><div class="pp-live-right">${r}</div></div>`}).join('')||'<div class="pp-live-empty">目前沒有車手資料</div>';e('ppLiveRaceControl').innerHTML=(d.raceControl||[]).slice(0,14).map(x=>`<div class="pp-live-msg"><strong>${esc(x.Flag||x.Category||'Race Control')}${x.Lap?' · LAP '+esc(x.Lap):''}</strong><div class="pp-live-detail">${esc(x.Message||'')}</div></div>`).join('')||'<div class="pp-live-empty">目前沒有訊息</div>';e('ppLiveUpdated').textContent=d.source==='archive'?'資料來源：Paddock Pulse Live Archive':'最後更新：'+(d.lastTimingAt?new Date(d.lastTimingAt).toLocaleString('zh-TW'):'—')}
async function get(path){const c=new AbortController(),t=setTimeout(()=>c.abort(),REQUEST_TIMEOUT_MS);try{const r=await fetch(RELAY+path,{cache:'no-store',signal:c.signal});if(!r.ok)throw Error(r.status);return await r.json()}finally{clearTimeout(t)}}
function usable(d){if(d?.status==='LIVE')return true;if(!d?.drivers?.length)return false;if(['practice','qualifying'].includes(kind(d))){const a=Date.now()-Date.parse(d.lastMessageAt||d.lastTimingAt||0);if(Number.isFinite(a)&&a<1800000)return true}return d?.status==='STALE'||d?.status==='CONNECTING'}
function delay(d,f){if(f)return STALE_POLL_MS;if(d?.source==='live'&&d.status==='LIVE')return kind(d)==='race'?RACE_POLL_MS:LIVE_POLL_MS;if(d?.source==='live'&&['STALE','CONNECTING'].includes(d.status))return STALE_POLL_MS;return IDLE_POLL_MS}
function schedule(ms){clearTimeout(pollTimer);if(active&&liveMode==='latest'&&!document.hidden)pollTimer=setTimeout(()=>load(true),ms)}
async function load(fromPoll=false){if(!active||liveMode!=='latest')return;if(requestInFlight){if(fromPoll)schedule(1500);return}requestInFlight=true;const seq=++requestSeq;let out=null,failed=false;try{const l=await get('/api/live');if(seq!==requestSeq||!active)return;if(usable(l)){render(l);out=l}else{const a=await get('/api/archive/latest');if(seq!==requestSeq||!active)return;render(a);out=a}}catch(err){failed=true;if(seq===requestSeq&&active){status(latest?'STALE':'OFFLINE');if(!latest)e('ppLiveDrivers').innerHTML='<div class="pp-live-empty">目前無法連線 Live relay，系統會自動重試。</div>'}}finally{if(seq===requestSeq){requestInFlight=false;schedule(delay(out,failed))}}}

async function loadMeetings(){
  const data=await get('/api/archive/meetings');
  meetings=data.meetings||[];
  const sel=e('ppLiveMeeting');
  if(!sel)return;
  sel.innerHTML=meetings.map((m,i)=>`<option value="${i}">${esc(m.Name||('Meeting '+(i+1)))}</option>`).join('');
  if(meetings.length){sel.value=String(meetings.length-1);fillHistorySessions()}
}
function fillHistorySessions(){
  const m=meetings[Number(e('ppLiveMeeting')?.value)];
  const sel=e('ppLiveSession');
  if(!sel)return;
  const sessions=m?.Sessions||[];
  sel.innerHTML=sessions.map((s,i)=>`<option value="${i}">${esc(s.Name||s.Type||('Session '+(i+1)))}</option>`).join('');
  if(sessions.length){sel.value=String(sessions.length-1);loadSelectedHistory()}
}
async function loadSelectedHistory(){
  const m=meetings[Number(e('ppLiveMeeting')?.value)];
  const s=m?.Sessions?.[Number(e('ppLiveSession')?.value)];
  if(!s?.Path)return;
  status('LOADING');
  try{render(await get('/api/archive/session?path='+encodeURIComponent(s.Path)))}catch{status('OFFLINE')}
}
async function setLiveTab(mode){
  liveMode=mode==='history'?'history':'latest';
  document.querySelectorAll('[data-pp-live-tab]').forEach(b=>b.classList.toggle('active',b.dataset.ppLiveTab===liveMode));
  e('ppLiveHistory')?.classList.toggle('show',liveMode==='history');
  clearTimeout(pollTimer);
  requestSeq++;
  requestInFlight=false;
  if(liveMode==='latest'){load(false)}
  else if(!meetings.length){await loadMeetings()}
  else{fillHistorySessions()}
}

function start(){if(active)return;active=true;load(false)}function stop(){active=false;clearTimeout(pollTimer);requestSeq++;requestInFlight=false}
function updateVersion(){document.documentElement.dataset.ppUi=VERSION;document.querySelectorAll('.panel.info').forEach(n=>n.innerHTML=n.innerHTML.replace(/Paddock Pulse V1\.\d+(?:\.\d+){1,2}/,'Paddock Pulse V1.16.4'))}
function wire(){document.addEventListener('click',ev=>{const tab=ev.target.closest('[data-pp-live-tab]');if(tab){setLiveTab(tab.dataset.ppLiveTab);return}const md=ev.target.closest('[data-pp-live-mode]');if(md){gapMode=md.dataset.ppLiveMode;document.querySelectorAll('[data-pp-live-mode]').forEach(x=>x.classList.toggle('active',x===md));if(latest)render(latest);return}const n=ev.target.closest('.bottom [data-go]');if(!n)return;if(n.dataset.go==='live')setTimeout(start,0);else if(active)stop()},true);e('ppLiveMeeting')?.addEventListener('change',fillHistorySessions);e('ppLiveSession')?.addEventListener('change',loadSelectedHistory);document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else if(!document.getElementById('live')?.classList.contains('hidden'))start()});setInterval(tick,1000)}

function installTrackMapFix(){
  const oldNormalize=window.normalizeCircuitKey;
  const oldStatus=window.trackMapStatus;
  if(typeof oldNormalize!=='function'||typeof oldStatus!=='function')return;

  const alias={monte_carlo:'monaco',losail:'lusail',vegas:'las_vegas'};
  window.normalizeCircuitKey=function(race){
    const raw=String(race?.Circuit?.circuitId||'').toLowerCase();
    if(alias[raw])return alias[raw];
    return oldNormalize(race);
  };

  window.trackMapStatus=function(race){
    const raw=String(race?.Circuit?.circuitId||'').toLowerCase();
    const fixed=alias[raw]||window.normalizeCircuitKey(race);
    let target=race;
    if(fixed&&fixed!==raw){
      target={...race,Circuit:{...(race?.Circuit||{}),circuitId:fixed}};
    }
    const base=oldStatus(target);
    if(!base?.slug)return base;

    const minimal='circuits/minimal/white-outline/'+base.slug+'.svg';
    const detailed='circuits/detailed/white-outline/'+base.slug+'.svg';
    const local=['las-vegas-1','lusail-1'].includes(base.slug)?['./assets/'+base.slug+'.svg']:[];
    const urls=[
      ...local,
      'https://cdn.jsdelivr.net/gh/julesr0y/f1-circuits-svg@main/'+minimal,
      'https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/'+minimal,
      'https://cdn.jsdelivr.net/gh/julesr0y/f1-circuits-svg@main/'+detailed,
      'https://raw.githubusercontent.com/julesr0y/f1-circuits-svg/main/'+detailed
    ];
    return {...base,key:fixed||base.key,url:urls[0],candidates:urls};
  };

  setTimeout(()=>{
    try{if(typeof window.render==='function')window.render()}catch{}
  },120);
}

function init(){injectStyles();installNav();installView();installTrackMapFix();updateVersion();wire()}
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',init,{once:true}):init();
})();