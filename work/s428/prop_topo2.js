/* S428 esboço TOPO NOVO + 3 BOTÕES IGUAIS (dono 18/11 23:11, ideia aprovada):
   - Celular: logo LA FOUCH à esquerda; à direita busca, carrinho e ☰ (nessa ordem); sai o ícone de conta do topo (a conta fica no cartão do menu).
   - Os 3 abrem do MESMO jeito: uma folha que cobre a tela toda abaixo do topo, entrando com esmaecer + subida de 8 px em 0,25 s (mesma curva),
     e saindo com o mesmo movimento ao contrário em 0,2 s. O ícone tocado vira × no mesmo lugar e fecha.
   - No PC (≥ 1100 px) nada muda. Respeita "reduzir movimento". */
(function(){
  var PC=matchMedia('(min-width:1100px)');
  var E='cubic-bezier(.2,.8,.2,1)';
  var css='@media (max-width:1099px){'+
    'html body .top .bar>#contabtn{display:none!important}'+
    'html.v5 body .top .bar>.logo,html body .top .bar>.logo{order:0!important;position:relative!important;left:auto!important;transform:none!important;margin:0 auto 0 0!important;background-position:left center!important}'+
    'html.v5 body .top .bar>#sbtn{order:1!important}html.v5 body .top .bar>#bagbtn{order:2!important}html.v5 body .top .bar>#mnb{order:3!important;margin-left:0!important}'+
    'html.lfo body .top{z-index:10060!important}'+
    'html.lfo-busca body #sov{top:var(--hth,73px)!important;height:auto!important;bottom:0!important}'+
    'html.lfo-busca body #sov .sosc{display:none!important}'+
    'html.lfo-busca body #sov .sopn{position:absolute!important;inset:0!important;max-width:none!important;width:auto!important;border-radius:0!important;transform:none!important;box-shadow:none!important;background:var(--bg)!important}'+
    '.lfx3{display:none}html.lfo-menu #mnb .lfx3,html.lfo-busca #sbtn .lfx3,html.lfo-cart #bagbtn .lfx3{display:block}'+
    'html.lfo-menu #mnb>svg:not(.lfx3):not(.lfx),html.lfo-busca #sbtn>svg:not(.lfx3),html.lfo-cart #bagbtn>svg:not(.lfx3){display:none}'+
    'html.lfo-cart #bagbtn .bdg,html.lfo-cart #bagbtn [class*=cnt]{visibility:hidden}'+
    '#mnb .lfx{display:none!important}'+
    '@keyframes lfsh{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}'+
    'html.lfo-menu body #drw .dpn,html.lfo-busca body #sov .sopn,html.lfo-cart body #layer .scrim.pg>*{animation:lfsh .25s '+E+' both!important}'+
    '@media (prefers-reduced-motion:reduce){html.lfo-menu body #drw .dpn,html.lfo-busca body #sov .sopn,html.lfo-cart body #layer .scrim.pg>*{animation:none!important}}'+
  '}';
  var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);
  var X='<path d="M6 6l12 12M18 6L6 18"/>';
  function poeX(b){if(!b||b.querySelector('.lfx3'))return;var x=document.createElementNS('http://www.w3.org/2000/svg','svg');x.setAttribute('class','lfx3');x.setAttribute('width','22');x.setAttribute('height','22');x.setAttribute('viewBox','0 0 24 24');x.setAttribute('fill','none');x.setAttribute('stroke','currentColor');x.setAttribute('stroke-width','2');x.setAttribute('stroke-linecap','round');x.setAttribute('aria-hidden','true');x.innerHTML=X;b.appendChild(x)}
  var cart=false;
  function estado(){if(PC.matches)return;var h=document.documentElement,d=document.getElementById('drw'),so=document.getElementById('sov'),ly=document.querySelector('#layer .scrim.pg');
    if(!ly)cart=false;
    var m=!!(d&&d.classList.contains('on')),b=!!(so&&so.classList.contains('on')),c=cart&&!!ly;
    h.classList.toggle('lfo-menu',m);h.classList.toggle('lfo-busca',b);h.classList.toggle('lfo-cart',c);h.classList.toggle('lfo',m||b||c);
    ['mnb','sbtn','bagbtn'].forEach(function(id){poeX(document.getElementById(id))});
    var mn=document.getElementById('mnb');if(mn)mn.setAttribute('aria-label',m?'Fechar menu':'Menu');
    var sb=document.getElementById('sbtn');if(sb)sb.setAttribute('aria-label',b?'Fechar a busca':'Buscar');
    var bg=document.getElementById('bagbtn');if(bg)bg.setAttribute('aria-label',c?'Fechar o carrinho':'Abrir o carrinho')}
  function sai(el,feito){if(!el||matchMedia('(prefers-reduced-motion: reduce)').matches){feito();return}
    try{var a=el.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(8px)'}],{duration:200,easing:'cubic-bezier(.4,0,.6,1)',fill:'forwards'});a.onfinish=feito}catch(_){feito()}}
  document.addEventListener('click',function(e){if(PC.matches)return;var h=document.documentElement,t=e.target.closest&&e.target.closest('#mnb,#sbtn,#bagbtn');if(!t)return;
    var id=t.id,aberto=(id==='mnb'&&h.classList.contains('lfo-menu'))||(id==='sbtn'&&h.classList.contains('lfo-busca'))||(id==='bagbtn'&&h.classList.contains('lfo-cart'));
    if(aberto){e.preventDefault();e.stopImmediatePropagation();
      if(id==='mnb'){var d=document.getElementById('drw');sai(d&&d.querySelector('.dpn'),function(){var c=d.querySelector('[data-dclose]');c&&c.click()})}
      else if(id==='sbtn'){var so=document.getElementById('sov');sai(so&&so.querySelector('.sopn'),function(){var c=so.querySelector('[data-sox]');c&&c.click()})}
      else{var ly=document.querySelector('#layer .scrim.pg');sai(ly&&ly.firstElementChild,function(){var c=ly&&ly.querySelector('button.x,[aria-label="Fechar"]');c&&c.click()})}
      return}
    /* abrir um com outro aberto: fecha o outro sem pular */
    if(h.classList.contains('lfo-menu')&&id!=='mnb'){var c1=document.querySelector('#drw [data-dclose]');c1&&c1.click()}
    if(h.classList.contains('lfo-busca')&&id!=='sbtn'){var c2=document.querySelector('#sov [data-sox]');c2&&c2.click()}
    if(id==='bagbtn')cart=true},true);
  var t0=0;new MutationObserver(function(){if(t0)return;t0=requestAnimationFrame(function(){t0=0;estado()})}).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});estado();
})();
