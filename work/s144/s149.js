/* S149 esboço: 3 cabeçalhos de PC (A uma linha, B duas linhas, C B encolhido ao rolar) */
(function(){
var lg=getComputedStyle(document.querySelector('.top .logo')).backgroundImage;
var I={
 bus:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
 conta:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
 sac:'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 7h12l-1 13H7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>'};
var css=document.createElement('style');css.textContent=
'html.v5 body .top{visibility:hidden!important}'+
'.h49{position:fixed;left:0;right:0;top:0;z-index:999;background:color-mix(in srgb,#fbf7fa 94%,transparent);backdrop-filter:blur(10px);border-bottom:1px solid #efe3ea;font-family:var(--body);color:#2a1f27}'+
'.h49 .in{width:min(1320px,92vw);margin:0 auto;display:flex;align-items:center}'+
'.h49 .lg{width:112px;height:56px;background:'+lg+' left center/contain no-repeat;flex:none}'+
'.h49 nav{display:flex;align-items:center;gap:28px}.h49 nav a{position:relative;font-size:15px;font-weight:500;color:#2a1f27;text-decoration:none;padding:6px 0}.h49 nav a:after{content:"";position:absolute;left:0;right:0;bottom:0;height:1.5px;background:#8d3a69;transform:scaleX(0);transition:transform .25s}.h49 nav a.on:after,.h49 nav a.hv:after{transform:scaleX(1)}.h49 nav a.of{color:#8d3a69}.h49 nav .sep{width:1px;height:18px;background:#e2d3dc}'+
'.h49 .ic{display:flex;align-items:center;gap:22px}.h49 .ic button{border:0;background:none;color:#2a1f27;display:flex;align-items:center;gap:6px;font:500 14px var(--body);position:relative;padding:4px}.h49 .ic b{position:absolute;top:-4px;right:-8px;min-width:18px;height:18px;border-radius:99px;background:#8d3a69;color:#fff;font:700 10.5px/18px var(--body);text-align:center}'+
'.h49 .lng{border:1px solid #e2d3dc!important;border-radius:99px;padding:6px 12px!important;font-size:13px!important}'+
'.h49 .bs{display:flex;align-items:center;gap:8px;height:40px;width:260px;padding:0 16px;border:1px solid #e2d3dc;border-radius:999px;background:#fff;color:#7a6772;font-size:14px}'+
/* A */ '.h49.A .in{height:76px;gap:40px}.h49.A nav{flex:1;justify-content:center}'+
/* B */ '.h49.B .r1{height:84px;display:grid;grid-template-columns:1fr auto 1fr}.h49.B .r1 .lg{width:150px;height:64px;background-position:center}.h49.B .r1 .ic{justify-self:end}.h49.B .r2{height:50px;border-top:1px solid #efe3ea;justify-content:center}'+
'.h49 .mn{border:0;background:none;display:flex;align-items:center;gap:10px;font:500 15px var(--body);color:#2a1f27;padding:4px}'+'.h49.D .r1{height:84px;display:grid;grid-template-columns:1fr auto 1fr}.h49.D .r1 .lg{width:150px;height:64px;background-position:center}.h49.D .r1 .ic:last-child{justify-self:end}'+
/* C */ '.h49.C .in{height:60px;gap:36px}.h49.C .lg{width:86px;height:40px}.h49.C nav{flex:1;justify-content:center;gap:26px}';
document.head.appendChild(css);
function nav(){return '<nav><a class="on">Solar</a><a>Leitura</a><a class="hv">Armações</a><a class="of">Ofertas</a><span class="sep"></span><a>Atacado</a><a>Ajuda</a></nav>'}
var lng='<button class="lng">PT · R$</button>',conta='<button aria-label="Conta">'+I.conta+'</button>',sac='<button aria-label="Carrinho">'+I.sac+'<b>2</b></button>',lupa='<button aria-label="Buscar">'+I.bus+'</button>',bs='<div class="bs">'+I.bus+'Buscar modelo ou referência</div>';
I.menu='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg>';
var mn='<button class="mn">'+I.menu+'<span>Menu</span></button>';
window.__s49=function(o){var h=document.querySelector('.h49');if(h)h.remove();h=document.createElement('header');h.className='h49 '+o;
 if(o==='A')h.innerHTML='<div class="in"><span class="lg"></span>'+nav()+'<div class="ic">'+lupa+lng+conta+sac+'</div></div>';
 if(o==='B')h.innerHTML='<div class="in r1">'+bs+'<span class="lg"></span><div class="ic">'+lng+conta+sac+'</div></div><div class="in r2">'+nav()+'</div>';
 if(o==='D')h.innerHTML='<div class="in r1"><div class="ic">'+mn+'</div><span class="lg"></span><div class="ic">'+lupa+conta+sac+'</div></div>';
 if(o==='C')h.innerHTML='<div class="in"><span class="lg"></span>'+nav()+'<div class="ic">'+lupa+lng+sac+'</div></div>';
 document.body.appendChild(h);var hh=h.offsetHeight;document.getElementById('topo').style.paddingTop=(hh-60)+'px'};
})();
