(() => {
  'use strict';
  const UI_VERSION='1.15.0';

  function networkBadge(){
    let el=document.getElementById('ppNetwork');
    if(!el){
      const brand=document.querySelector('.top>div');
      if(!brand)return;
      el=document.createElement('span');
      el.id='ppNetwork';
      brand.appendChild(el);
    }
    const online=navigator.onLine;
    el.textContent=online?'Online data':'Offline cache';
    el.classList.toggle('offline',!online);
  }

  function installShortcuts(){
    const hero=document.getElementById('hero');
    if(!hero||document.querySelector('.home-shortcuts'))return;
    const rail=document.createElement('div');
    rail.className='home-shortcuts';
    rail.setAttribute('aria-label','快速功能');
    rail.innerHTML=
      '<button class="home-shortcut" data-go="schedule"><strong>賽程</strong><small>Weekend</small></button>'+
      '<button class="home-shortcut" data-go="results"><strong>賽果</strong><small>Results</small></button>'+
      '<button class="home-shortcut" data-go="favorites"><strong>我的</strong><small>Paddock</small></button>';
    hero.insertAdjacentElement('afterend',rail);
  }

  function updateVersion(){
    document.documentElement.dataset.ppUi=UI_VERSION;
    document.querySelectorAll('.panel.info').forEach(el=>{
      el.innerHTML=el.innerHTML.replace(
        /Paddock Pulse V1\.\d+(?:\.\d+){1,2}/,
        'Paddock Pulse V1.15.0'
      );
    });
  }

  function refineCopy(){
    const tiny=document.querySelector('.top .tiny');
    if(tiny)tiny.textContent='2026 FORMULA 1 · WEEKEND COMPANION';
  }

  function animateInitialViewOnce(){
    const view=document.querySelector('.view:not(.hidden)');
    if(!view || matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    view.classList.add('pp-enter');
    setTimeout(()=>view.classList.remove('pp-enter'),360);
  }

  function completionMs(type){
    if(['fp1','fp2','fp3'].includes(type?.id))return 90*60*1000;
    if(['qualifying','sq'].includes(type?.id))return 100*60*1000;
    if(type?.id==='sprint')return 120*60*1000;
    if(type?.id==='race')return 180*60*1000;
    return 120*60*1000;
  }

  function scheduledItems(){
    try{
      if(typeof state==='undefined'||!Array.isArray(state.races)||
         typeof availableTypes!=='function'||typeof scheduledSession!=='function'||
         typeof sessionDate!=='function') return [];

      const out=[];
      for(const race of state.races){
        for(const type of availableTypes(race)){
          const value=scheduledSession(race,type);
          const at=value ? +sessionDate(value) : NaN;
          if(Number.isFinite(at))out.push({race,type,value,at});
        }
      }
      return out.sort((a,b)=>a.at-b.at);
    }catch{return []}
  }

  function latestCompletedResult(){
    try{
      const now=Date.now(), items=scheduledItems(), done=[];
      const byRace=new Map();

      for(const item of items){
        const key=String(item.race.round);
        if(!byRace.has(key))byRace.set(key,[]);
        byRace.get(key).push(item);
      }

      for(const group of byRace.values()){
        group.sort((a,b)=>a.at-b.at);
        for(let i=0;i<group.length;i++){
          const cur=group[i], next=group[i+1];
          const key=String(cur.race.round)+'-'+cur.type.id;
          const cached=(state.resultCache&&state.resultCache[key]) ||
            (typeof saved==='function' ? saved('sessionResult2026_'+key,null) : null);
          const confirmed=Array.isArray(cached?.rows)&&cached.rows.length>0;
          if((next&&next.at<=now)||confirmed||cur.at+completionMs(cur.type)<=now){
            done.push(cur);
          }
        }
      }

      done.sort((a,b)=>b.at-a.at);
      return done[0]||null;
    }catch{return null}
  }

  function nextSession(){
    const now=Date.now();
    return scheduledItems().find(x=>x.at>now)||null;
  }

  function activeWeekendRace(){
    const next=nextSession();
    const latest=latestCompletedResult();
    if(next&&latest&&String(next.race.round)===String(latest.race.round))return next.race;
    return next?.race||latest?.race||null;
  }

  function formatSessionTime(item){
    if(!item)return'—';
    try{
      return new Intl.DateTimeFormat('zh-TW',{
        month:'numeric',day:'numeric',weekday:'short',
        hour:'2-digit',minute:'2-digit',hour12:false
      }).format(new Date(item.at));
    }catch{return'—'}
  }

  function applyLatestResultDefault(){
    const hit=latestCompletedResult();
    if(!hit)return false;

    state.resultRound=String(hit.race.round);
    state.resultSession=hit.type.id;

    const select=document.getElementById('resultRound');
    if(select&&[...select.options].some(o=>o.value===String(hit.race.round))){
      select.value=String(hit.race.round);
    }
    return true;
  }

  function installResultsAutoAdvance(){
    document.addEventListener('click',event=>{
      if(event.target.closest('[data-openresults]'))return;
      if(event.target.closest('[data-go="results"]'))applyLatestResultDefault();
    },true);

    setTimeout(()=>{
      const results=document.getElementById('results');
      if(results&&!results.classList.contains('hidden')){
        const changed=applyLatestResultDefault();
        if(changed&&typeof renderResultHeader==='function'){
          renderResultHeader();
          if(typeof loadSelectedResult==='function')loadSelectedResult();
        }
      }
    },700);
  }

  function installRaceHub(){
    const home=document.getElementById('home');
    const shortcuts=document.querySelector('.home-shortcuts');
    if(!home||!shortcuts)return;

    let hub=document.getElementById('ppRaceHub');
    if(!hub){
      hub=document.createElement('section');
      hub.id='ppRaceHub';
      hub.className='pp-race-hub';
      shortcuts.insertAdjacentElement('afterend',hub);
    }
    renderRaceHub();
  }

  function raceCircuitLabel(race){
    return race?.Circuit?.circuitName ||
      race?.Circuit?.Location?.locality ||
      race?.Circuit?.Location?.country ||
      'Circuit';
  }

  function tyreLabel(race){
    try{
      if(typeof officialTyreFor!=='function')return null;
      const t=officialTyreFor(race);
      if(!t)return null;
      return [t.hard,t.medium,t.soft].filter(Boolean).join(' · ');
    }catch{return null}
  }

  function renderRaceHub(){
    const hub=document.getElementById('ppRaceHub');
    if(!hub)return;

    const next=nextSession();
    const latest=latestCompletedResult();
    const race=activeWeekendRace();

    if(!race){
      hub.innerHTML='<div class="pp-race-hub-empty">目前沒有可整理的賽事資訊。</div>';
      return;
    }

    const latestAction=latest
      ? `<button class="pp-hub-session pp-hub-result" data-openresults="${String(latest.race.round)}" data-ses="${latest.type.id}">
           <span class="pp-hub-kicker">LATEST RESULT</span>
           <strong>${latest.type.full||latest.type.label||latest.type.id}</strong>
           <small>${formatSessionTime(latest)}</small>
           <b>查看賽果 →</b>
         </button>`
      : `<div class="pp-hub-session pp-hub-result">
           <span class="pp-hub-kicker">LATEST RESULT</span>
           <strong>尚無已完成場次</strong>
           <small>結果公布後會自動更新</small>
         </div>`;

    const nextAction=next
      ? `<button class="pp-hub-session pp-hub-next" data-go="schedule">
           <span class="pp-hub-kicker">NEXT SESSION</span>
           <strong>${next.type.full||next.type.label||next.type.id}</strong>
           <small>${formatSessionTime(next)}</small>
           <b>查看週末 →</b>
         </button>`
      : `<div class="pp-hub-session pp-hub-next">
           <span class="pp-hub-kicker">NEXT SESSION</span>
           <strong>本站已全部完成</strong>
           <small>等待下一站賽程</small>
         </div>`;

    const tyre=tyreLabel(race);

    hub.innerHTML=`
      <div class="pp-race-hub-head">
        <div>
          <span class="pp-hub-kicker">RACE WEEKEND HUB</span>
          <h2>${race.raceName||'Race Weekend'}</h2>
          <p>${raceCircuitLabel(race)}</p>
        </div>
        <span class="pp-round-badge">R${race.round||'—'}</span>
      </div>
      <div class="pp-hub-sessions">${latestAction}${nextAction}</div>
      <div class="pp-hub-tools">
        <button data-opencircuit="${String(race.round)}">
          <span>⌁</span><div><small>TRACK</small><strong>${raceCircuitLabel(race)}</strong></div>
        </button>
        <button data-opencircuit="${String(race.round)}">
          <span>◉</span><div><small>TYRES</small><strong>${tyre||'尚未核實'}</strong></div>
        </button>
        <button data-opencircuit="${String(race.round)}">
          <span>☁</span><div><small>WEATHER</small><strong>逐小時預報</strong></div>
        </button>
      </div>`;
  }

  function installResultsContext(){
    const results=document.getElementById('results');
    const banner=document.getElementById('resultRaceBanner');
    if(!results||!banner)return;

    let node=document.getElementById('ppResultsContext');
    if(!node){
      node=document.createElement('div');
      node.id='ppResultsContext';
      node.className='pp-results-context';
      banner.insertAdjacentElement('afterend',node);
    }
    renderResultsContext();
  }

  function renderResultsContext(){
    const node=document.getElementById('ppResultsContext');
    if(!node)return;
    const latest=latestCompletedResult();
    const next=nextSession();

    node.innerHTML=`
      <div>
        <span>LATEST COMPLETED</span>
        <strong>${latest ? 'R'+latest.race.round+' · '+(latest.type.full||latest.type.label||latest.type.id) : '—'}</strong>
      </div>
      <div>
        <span>NEXT UP</span>
        <strong>${next ? 'R'+next.race.round+' · '+(next.type.full||next.type.label||next.type.id) : 'Season complete'}</strong>
      </div>`;
  }

  function watchAppData(){
    const targets=['homeWeekend','resultRaceBanner']
      .map(id=>document.getElementById(id))
      .filter(Boolean);

    if(!targets.length)return;

    let pending=false;
    const refresh=()=>{
      if(pending)return;
      pending=true;
      setTimeout(()=>{
        pending=false;
        renderRaceHub();
        renderResultsContext();
      },120);
    };

    const observer=new MutationObserver(refresh);
    targets.forEach(target=>observer.observe(target,{childList:true,subtree:true}));
  }

  function init(){
    networkBadge();
    installShortcuts();
    updateVersion();
    refineCopy();
    animateInitialViewOnce();
    installResultsAutoAdvance();
    installRaceHub();
    installResultsContext();
    watchAppData();

    setTimeout(()=>{
      renderRaceHub();
      renderResultsContext();
    },900);

    setTimeout(()=>{
      renderRaceHub();
      renderResultsContext();
    },2500);

    window.addEventListener('online',networkBadge);
    window.addEventListener('offline',networkBadge);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();