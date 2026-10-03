(() => {
  'use strict';
  const UI_VERSION='1.14.2';

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
    const home=document.getElementById('home');
    const hero=document.getElementById('hero');
    if(!home||!hero||document.querySelector('.home-shortcuts'))return;
    const rail=document.createElement('div');
    rail.className='home-shortcuts';
    rail.setAttribute('aria-label','快速功能');
    rail.innerHTML=`
      <button class="home-shortcut" data-go="schedule"><strong>賽程</strong><small>Weekend</small></button>
      <button class="home-shortcut" data-go="results"><strong>賽果</strong><small>Results</small></button>
      <button class="home-shortcut" data-go="favorites"><strong>我的</strong><small>Paddock</small></button>`;
    hero.insertAdjacentElement('afterend',rail);
  }

  function updateVersion(){
    document.documentElement.dataset.ppUi=UI_VERSION;
    document.querySelectorAll('.panel.info').forEach(el=>{
      if(/Paddock Pulse V1\.14\.1/.test(el.textContent)){
        el.innerHTML=el.innerHTML.replace('Paddock Pulse V1.14.1','Paddock Pulse V1.14.2');
      }
    });
  }

  function refineCopy(){
    const tiny=document.querySelector('.top .tiny');
    if(tiny && tiny.textContent.trim()==='YOUR RACE WEEKEND'){
      tiny.textContent='2026 FORMULA 1 · WEEKEND COMPANION';
    }
  }

  function animateVisibleView(){
    const view=document.querySelector('.view:not(.hidden)');
    if(!view)return;
    view.classList.remove('pp-enter');
    requestAnimationFrame(()=>view.classList.add('pp-enter'));
    setTimeout(()=>view.classList.remove('pp-enter'),360);
  }

  function watchViews(){
    const views=[...document.querySelectorAll('.view')];
    const observer=new MutationObserver(records=>{
      if(records.some(r=>r.attributeName==='class'))animateVisibleView();
    });
    views.forEach(v=>observer.observe(v,{attributes:true,attributeFilter:['class']}));
  }

  function init(){
    networkBadge();
    installShortcuts();
    updateVersion();
    refineCopy();
    watchViews();
    window.addEventListener('online',networkBadge);
    window.addEventListener('offline',networkBadge);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
