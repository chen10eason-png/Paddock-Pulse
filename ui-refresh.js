(() => {
  'use strict';
  const UI_VERSION='1.14.2.3';

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
        /Paddock Pulse V1\.14\.(?:1|2)(?:\.1|\.2)?/,
        'Paddock Pulse V1.14.2.3'
      );
    });
  }

  function refineCopy(){
    const tiny=document.querySelector('.top .tiny');
    if(tiny && tiny.textContent.trim()==='YOUR RACE WEEKEND'){
      tiny.textContent='2026 FORMULA 1 · WEEKEND COMPANION';
    }
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

  function latestCompletedResult(){
    try{
      if(typeof state==='undefined' ||
         !Array.isArray(state.races) ||
         typeof availableTypes!=='function' ||
         typeof scheduledSession!=='function' ||
         typeof sessionDate!=='function'){
        return null;
      }

      const now=Date.now();
      const finished=[];

      for(const race of state.races){
        const sessions=availableTypes(race)
          .map(type=>{
            const value=scheduledSession(race,type);
            const at=value ? +sessionDate(value) : NaN;
            return {race,type,at};
          })
          .filter(x=>Number.isFinite(x.at))
          .sort((a,b)=>a.at-b.at);

        for(let i=0;i<sessions.length;i++){
          const cur=sessions[i];
          const next=sessions[i+1];
          const nextStarted=!!next && next.at<=now;

          const key=String(race.round)+'-'+cur.type.id;
          const cached=(state.resultCache&&state.resultCache[key]) ||
            (typeof saved==='function' ? saved('sessionResult2026_'+key,null) : null);
          const confirmedByCache=Array.isArray(cached?.rows)&&cached.rows.length>0;

          const conservativeFinished=cur.at+completionMs(cur.type)<=now;

          if(nextStarted || confirmedByCache || conservativeFinished){
            finished.push(cur);
          }
        }
      }

      finished.sort((a,b)=>b.at-a.at);
      const hit=finished[0];
      return hit ? {
        round:String(hit.race.round),
        session:hit.type.id
      } : null;
    }catch(err){
      return null;
    }
  }

  function applyLatestResultDefault(){
    const hit=latestCompletedResult();
    if(!hit)return false;

    state.resultRound=hit.round;
    state.resultSession=hit.session;

    // Also update the picker immediately when it already exists.
    const select=document.getElementById('resultRound');
    if(select && [...select.options].some(o=>o.value===hit.round)){
      select.value=hit.round;
    }
    return true;
  }

  function installResultsAutoAdvance(){
    // Runs before the app's own click handler.
    document.addEventListener('click',event=>{
      if(event.target.closest('[data-openresults]'))return;
      if(event.target.closest('[data-go="results"]')){
        applyLatestResultDefault();
      }
    },true);

    // If the results page is already visible after an app restore, correct it once.
    setTimeout(()=>{
      const results=document.getElementById('results');
      if(results && !results.classList.contains('hidden')){
        const changed=applyLatestResultDefault();
        if(changed && typeof renderResultHeader==='function'){
          renderResultHeader();
          if(typeof loadSelectedResult==='function')loadSelectedResult();
        }
      }
    },700);
  }

  function init(){
    networkBadge();
    installShortcuts();
    updateVersion();
    refineCopy();
    animateInitialViewOnce();
    installResultsAutoAdvance();
    window.addEventListener('online',networkBadge);
    window.addEventListener('offline',networkBadge);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();