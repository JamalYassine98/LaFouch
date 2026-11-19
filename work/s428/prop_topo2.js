/* S428 esboço TOPO NOVO + 3 FOLHAS IGUAIS (dono 18/11 23:11–23:30):
   - Celular: logo à esquerda; à direita busca, carrinho e ☰; sem ícone de conta no topo (fica no cartão do menu). PC (≥1100 px) não muda.
   - Busca, carrinho e menu abrem do MESMO jeito: uma folha que cobre a TELA TODA (inclusive logo e botões), com UMA animação só
     (esmaecer + subir 12 px, 0,28 s, mesma curva) e fecham com a mesma ao contrário (0,2 s). Os movimentos antigos de cada um ficam desligados.
   - Um único × fixo no canto de cima à direita da tela (8 px da borda, área de toque 44 px), igual nos 3 e em qualquer temática. Respeita "reduzir movimento". */
(function(){
  var PC=matchMedia('(min-width:1100px)'),RM=matchMedia('(prefers-reduced-motion: reduce)');
  var F='#drw.on .dpn,#sov.on .sopn,#layer .scrim.pg.lfct';
  var css='@media (max-width:1099px){'+
    'html body .top .bar>#contabtn{display:none!important}'+
    'html.v5 body .top .bar>.logo,html body .top .bar>.logo{order:0!important;position:relative!important;left:auto!important;transform:none!important;margin:0 auto 0 0!important;background-position:left center!important}'+
    'html.v5 body .top .bar>#sbtn{order:1!important}html.v5 body .top .bar>#bagbtn{order:2!important}html.v5 body .top .bar>#mnb{order:3!important;margin-left:0!important}'+
    '#mnb .lfx{display:none!important}html.lfap #mnb .lfh{display:block!important}'+
    /* as 3 folhas: tela toda, por cima do topo, sem os movimentos antigos */
    'html body #drw{z-index:10070!important}html body #sov{z-index:10070!important;top:0!important;height:auto!important;bottom:0!important}html body #layer:has(.scrim.pg.lfct){z-index:10070!important}'+
    'html body #drw.lfap.lfap.lfap.lfap .dpn{top:0!important;transition:none!important;opacity:0;transform:none!important;padding-top:72px!important}'+
    'html body #drw.lfap.lfap.lfap.lfap.on .dpn{opacity:1}'+
    'html body #sov .sosc{display:none!important}'+
    'html body #sov .sopn{position:absolute!important;inset:0!important;max-width:none!important;width:auto!important;border-radius:0!important;box-shadow:none!important;background:var(--bg)!important;transition:none!important;transform:none!important;padding-top:72px!important}'+
    'html.v5 body #layer .scrim.pg.lfct{top:0!important;z-index:10070!important;padding-top:56px!important;transition:none!important}'+
    'html body #layer .scrim.pg.lfct button.x{display:none!important}'+
    '@keyframes lfsh{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}'+
    'html body #drw.lfap.lfap.lfap.lfap.on .dpn,html body #sov.on .sopn,html.v5 body #layer .scrim.pg.lfct{animation:lfsh .28s cubic-bezier(.2,.8,.2,1) both!important}'+
    '@media (prefers-reduced-motion:reduce){html body #drw.lfap.lfap.lfap.lfap.on .dpn,html body #sov.on .sopn,html.v5 body #layer .scrim.pg.lfct{animation:none!important}}'+
    '#lfx3b{position:fixed;top:calc(8px + env(safe-area-inset-top,0px));right:8px;z-index:10090;width:44px;height:44px;border:0;background:none;color:var(--tx);display:none;align-items:center;justify-content:center;padding:0;cursor:pointer;-webkit-tap-highlight-color:transparent}'+
    'html.lfo #lfx3b{display:flex;animation:lfsh .28s cubic-bezier(.2,.8,.2,1) both}'+
  '}';
  var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);
  var xb=document.createElement('button');xb.id='lfx3b';xb.type='button';xb.setAttribute('aria-label','Fechar');
  xb.innerHTML='<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  document.body.appendChild(xb);
  function qual(){var d=document.getElementById('drw'),so=document.getElementById('sov');
    if(document.querySelector('#layer .scrim.pg.lfct'))return 'cart';if(so&&so.classList.contains('on'))return 'busca';if(d&&d.classList.contains('on'))return 'menu';return ''}
  var saindo=false,querCart=false;
  /* carrinho aberto pelo botão do topo: marca a folha e desliga o deslizar antigo (entra igual às outras) */
  document.addEventListener('click',function(e){if(PC.matches)return;if(e.target.closest&&e.target.closest('#bagbtn')){querCart=true;setTimeout(function(){querCart=false},600);requestAnimationFrame(marca)}},true);
  function marca(){var sc=document.querySelector('#layer .scrim.pg');if(!sc)return;if(querCart&&!sc.classList.contains('lfct')){sc.classList.add('lfct');querCart=false}
    if(sc.classList.contains('lfct')&&!saindo&&sc.getAnimations)sc.getAnimations().forEach(function(a){if(!a.animationName)try{a.cancel()}catch(_){}})}
  function estado(){if(PC.matches||saindo)return;marca();var q=qual(),h=document.documentElement,era=h.classList.contains('lfo');
    h.classList.toggle('lfo',!!q)}
  function folha(q){return q==='menu'?document.querySelector('#drw .dpn'):q==='busca'?document.querySelector('#sov .sopn'):document.querySelector('#layer .scrim.pg.lfct')}
  function fechaNativo(q){var c=q==='menu'?document.querySelector('#drw [data-dclose]'):q==='busca'?document.querySelector('#sov [data-sox]'):document.querySelector('#layer .scrim.pg.lfct button.x');c&&c.click()}
  xb.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();var q=qual();if(!q||saindo)return;var el=folha(q);
    if(!el||RM.matches||!el.animate){fechaNativo(q);return}
    saindo=true;var K=[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(12px)'}],O={duration:200,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'};
    var a=el.animate(K,O),b=xb.animate(K,O);
    a.onfinish=function(){if(q==='cart'){el.style.visibility='hidden';el.classList.remove('lfct')}fechaNativo(q);setTimeout(function(){try{if(q!=='cart')a.cancel();b.cancel()}catch(_){}saindo=false;estado()},80)}});
  var t0=0;new MutationObserver(function(){if(t0)return;t0=requestAnimationFrame(function(){t0=0;estado()})}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});estado();
})();
