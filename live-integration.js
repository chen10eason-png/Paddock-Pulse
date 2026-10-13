(() => {
  'use strict';

  const VERSION='1.16.0';
  const LIVE_URL='https://paddock-pulse-live.onrender.com/';

  function injectStyles(){
    if(document.getElementById('ppLiveIntegrationStyle'))return;
    const style=document.createElement('style');
    style.id='ppLiveIntegrationStyle';
    style.textContent=`
      /* Six-item dock for the new Live tab. */
      .bottom .glass-lens{
        left:calc(6px + (100% - 12px) * var(--active-index) / 6)!important;
        width:calc((100% - 12px) / 6)!important
      }
      #live.pp-live-view{padding-bottom:6px}
      .pp-live-head{
        display:flex;align-items:flex-end;justify-content:space-between;gap:14px;
        margin:3px 0 14px
      }
      .pp-live-head-copy{min-width:0}
      .pp-live-kicker{
        display:block;color:#ff737d;font-size:10px;font-weight:900;letter-spacing:2px
      }
      .pp-live-head h1{
        margin:7px 0 5px;font-size:clamp(36px,8vw,56px);
        line-height:.98;letter-spacing:-2.4px
      }
      .pp-live-head p{
        margin:0;color:#98a3b5;font-size:12px;line-height:1.55
      }
      .pp-live-actions{display:flex;gap:7px;flex:0 0 auto}
      .pp-live-action{
        border:1px solid rgba(255,255,255,.11);border-radius:12px;
        padding:9px 11px;background:rgba(255,255,255,.045);color:#e8edf4;
        font:inherit;font-size:10px;font-weight:800
      }
      .pp-live-shell{
        position:relative;overflow:hidden;border-radius:22px;
        border:1px solid rgba(255,255,255,.12);
        background:linear-gradient(180deg,#111722,#0c1017);
        box-shadow:0 18px 52px rgba(0,0,0,.28)
      }
      .pp-live-frame{
        display:block;width:100%;height:calc(100svh - 198px);min-height:560px;
        border:0;background:#080a0f
      }
      .pp-live-note{
        display:flex;align-items:center;gap:8px;padding:10px 13px;
        border-top:1px solid rgba(255,255,255,.07);
        color:#7f8b9d;font-size:9px;line-height:1.4;background:#0d121a
      }
      .pp-live-dot{
        width:6px;height:6px;border-radius:50%;background:#ff4f5d;
        box-shadow:0 0 0 4px rgba(255,79,93,.10);flex:0 0 auto
      }
      @media(max-width:390px){
        .bottom .glass-lens{
          left:calc(5px + (100% - 10px) * var(--active-index) / 6)!important;
          width:calc((100% - 10px) / 6)!important
        }
        .bottom .nav{font-size:9px!important}
        .bottom .nav svg{width:21px!important;height:21px!important}
        .pp-live-head{align-items:flex-start}
        .pp-live-actions{padding-top:4px}
        .pp-live-frame{height:calc(100svh - 184px);min-height:500px}
      }
    `;
    document.head.appendChild(style);
  }

  function liveIcon(){
    return `<svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4"></path>
      <path d="M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 4.6a10.5 10.5 0 0 1 0 14.8"></path>
    </svg>`;
  }

  function installNav(){
    const dock=document.querySelector('.bottom');
    if(!dock||dock.querySelector('[data-go="live"]'))return;

    const btn=document.createElement('button');
    btn.className='nav';
    btn.dataset.go='live';
    btn.setAttribute('aria-label','Live 即時計時');
    btn.innerHTML=`<i>${liveIcon()}</i><span>Live</span>`;

    const standings=dock.querySelector('[data-go="standings"]');
    if(standings)dock.insertBefore(btn,standings);
    else dock.appendChild(btn);
  }

  function installView(){
    if(document.getElementById('live'))return;
    const main=document.querySelector('main.app');
    if(!main)return;

    const section=document.createElement('section');
    section.id='live';
    section.className='view hidden pp-live-view';
    section.setAttribute('aria-label','Paddock Pulse Live 即時計時');
    section.innerHTML=`
      <div class="pp-live-head">
        <div class="pp-live-head-copy">
          <span class="pp-live-kicker">LIVE TIMING</span>
          <h1>Race live<span style="color:#ff535b">.</span></h1>
          <p>使用已完成實測的 Paddock Pulse Live relay。只在開啟 Live 頁面時連線。</p>
        </div>
        <div class="pp-live-actions">
          <button class="pp-live-action" data-pp-live-reload>重新連線</button>
          <button class="pp-live-action" data-pp-live-open>獨立開啟 ↗</button>
        </div>
      </div>
      <div class="pp-live-shell">
        <iframe
          id="ppLiveFrame"
          class="pp-live-frame"
          title="Paddock Pulse Live Timing"
          loading="lazy"
          referrerpolicy="no-referrer"
          src="about:blank"></iframe>
        <div class="pp-live-note">
          <span class="pp-live-dot"></span>
          <span>Live 頁面由 Render relay + F1 Live Timing 提供；CAPTCHA、登入或付費服務皆未加入。</span>
        </div>
      </div>`;
    main.appendChild(section);
  }

  function frame(){
    return document.getElementById('ppLiveFrame');
  }

  function startLive(force=false){
    const el=frame();
    if(!el)return;
    if(force || el.dataset.loaded!=='1'){
      el.src=LIVE_URL;
      el.dataset.loaded='1';
    }
  }

  function stopLive(){
    const el=frame();
    if(!el||el.dataset.loaded!=='1')return;
    el.src='about:blank';
    el.dataset.loaded='0';
  }

  function updateVersion(){
    document.documentElement.dataset.ppUi=VERSION;
    document.querySelectorAll('.panel.info').forEach(el=>{
      el.innerHTML=el.innerHTML.replace(
        /Paddock Pulse V1\.\d+(?:\.\d+){1,2}/,
        'Paddock Pulse V1.16.0'
      );
    });
  }

  function wire(){
    document.addEventListener('click',event=>{
      if(event.target.closest('[data-pp-live-reload]')){
        startLive(true);
        return;
      }
      if(event.target.closest('[data-pp-live-open]')){
        window.open(LIVE_URL,'_blank','noopener,noreferrer');
        return;
      }

      const nav=event.target.closest('.bottom [data-go]');
      if(!nav)return;

      if(nav.dataset.go==='live'){
        setTimeout(()=>startLive(false),0);
      }else if(!document.getElementById('live')?.classList.contains('hidden')){
        setTimeout(stopLive,80);
      }
    },true);

    document.addEventListener('visibilitychange',()=>{
      if(document.hidden && !document.getElementById('live')?.classList.contains('hidden')){
        stopLive();
      }else if(!document.hidden && !document.getElementById('live')?.classList.contains('hidden')){
        startLive(false);
      }
    });
  }

  function init(){
    injectStyles();
    installNav();
    installView();
    updateVersion();
    wire();
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',init,{once:true});
  }else{
    init();
  }
})();