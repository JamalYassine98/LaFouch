  /* ===== S420 TRILHO ÚNICO (aprovado 15/11: regra lógica da pílula S330f §8 + arrastar §5 + abas da Minha conta §6) =====
     A seleção é UM objeto só: uma pílula permanente por trilho (nunca criada/apagada na troca), medida do botão escolhido,
     só transform (deslocar + esticar o meio), letra branca recortada pela própria pílula (camada presa nela, clip-path),
     o trilho não é redesenhado na troca; aceita o dedo arrastando (solta na opção mais perto). Usado em .mct (Minha conta) e .seg (menu). */
  var TKZ=(function(){function bz(x1,y1,x2,y2){function a(t,p1,p2){var u=1-t;return 3*u*u*t*p1+3*u*t*t*p2+t*t*t}return function(x){if(x<=0)return 0;if(x>=1)return 1;var lo=0,hi=1,t=x;for(var i=0;i<26;i++){t=(lo+hi)/2;if(a(t,x1,x2)<x)lo=t;else hi=t}return a(t,y1,y2)}}return bz(.16,1,.3,1)})();
  var TKRM=matchMedia('(prefers-reduced-motion: reduce)');
  (function(){var s=document.createElement('style');s.id='lftk';s.textContent='.lfTk{position:relative;touch-action:pan-y;-webkit-user-select:none;user-select:none}.lfTk>button{position:relative;z-index:1}.lfTk>button.on{background:transparent!important}'+
    '.lfTk>.lfP{position:absolute;left:0;top:0;width:0;height:0;z-index:0;pointer-events:none}.lfTk>.lfP>b{position:absolute;left:0;top:0;display:block;background:var(--tkc,#a24a80);will-change:transform}.lfTk>.lfP>b.m{width:1px;transform-origin:0 0}'+
    '.lfTk>.lfPt{position:absolute;left:0;top:0;z-index:2;pointer-events:none;overflow:hidden}.lfTk>.lfPt>button{position:absolute!important;margin:0!important;background:transparent!important;color:#fff!important;box-shadow:none!important;border-color:transparent!important;flex:none!important;min-width:0!important;box-sizing:border-box;pointer-events:none}';
    document.head.appendChild(s)})();
  function tkBts(el){return [].filter.call(el.children,function(b){return b.tagName==='BUTTON'})}
  function tkMede(T){var bs=tkBts(T.el);T.m=bs.map(function(b){return {x:b.offsetLeft,y:b.offsetTop,w:b.offsetWidth,h:b.offsetHeight}});T.W=T.el.clientWidth;T.H=T.el.clientHeight;
    T.t.style.width=T.W+'px';T.t.style.height=T.H+'px';
    var cl=T.t.children;bs.forEach(function(b,i){var c=cl[i],m=T.m[i];if(!c)return;c.style.left=m.x+'px';c.style.top=m.y+'px';c.style.width=m.w+'px';c.style.height=m.h+'px'})}
  function tkSel(T){var bs=tkBts(T.el);for(var i=0;i<bs.length;i++)if(bs[i].classList.contains('on'))return i;return -1}
  function tkPoe(T,x,y,w,h){T.c={x:x,y:y,w:w,h:h};var r=h/2,p=T.p.children,mw=Math.max(0,w-2*r);
    p[0].style.cssText='width:'+r+'px;height:'+h+'px;border-radius:'+r+'px 0 0 '+r+'px;transform:translate('+x+'px,'+y+'px)';
    p[1].style.cssText='height:'+h+'px;transform:translate('+(x+r-.5)+'px,'+y+'px) scaleX('+(mw+1)+')';
    p[2].style.cssText='width:'+r+'px;height:'+h+'px;border-radius:0 '+r+'px '+r+'px 0;transform:translate('+(x+w-r)+'px,'+y+'px)';
    var cp='inset('+y+'px '+Math.max(0,T.W-x-w)+'px '+Math.max(0,T.H-y-h)+'px '+x+'px round '+r+'px)';T.t.style.clipPath=cp;T.t.style.webkitClipPath=cp;T.p.style.opacity=w>0?'1':'0'}
  function tkVai(T,i,anima){cancelAnimationFrame(T.raf);var m=T.m[i];if(!m){T.p.style.opacity='0';T.t.style.clipPath='inset(50%)';return}
    var a=T.c;if(!anima||!a||TKRM.matches||document.hidden){tkPoe(T,m.x,m.y,m.w,m.h);return}
    var t0=performance.now(),D=300,f=function(tt){var k=Math.min(1,(tt-t0)/D),e=TKZ(k);tkPoe(T,a.x+(m.x-a.x)*e,a.y+(m.y-a.y)*e,a.w+(m.w-a.w)*e,a.h+(m.h-a.h)*e);if(k<1)T.raf=requestAnimationFrame(f)};T.raf=requestAnimationFrame(f)}
  function lfTrilho(el){if(!el||el.__tk)return el&&el.__tk;var bs=tkBts(el);if(bs.length<2)return null;var on=bs.filter(function(b){return b.classList.contains('on')})[0];
    var cor=on?getComputedStyle(on).backgroundColor:'';el.classList.add('lfTk');if(cor&&cor!=='rgba(0, 0, 0, 0)')el.style.setProperty('--tkc',cor);
    var p=document.createElement('i');p.className='lfP';p.setAttribute('aria-hidden','true');p.innerHTML='<b class="l"></b><b class="m"></b><b class="r"></b>';el.insertBefore(p,el.firstChild);
    var t=document.createElement('span');t.className='lfPt';t.setAttribute('aria-hidden','true');t.inert=true;bs.forEach(function(b){var c=b.cloneNode(true);c.classList.remove('on');c.removeAttribute('data-cta');c.removeAttribute('id');c.setAttribute('tabindex','-1');c.removeAttribute('role');c.removeAttribute('aria-selected');t.appendChild(c)});el.appendChild(t);
    var T={el:el,p:p,t:t,c:null,raf:0,sel:-1};el.__tk=T;tkMede(T);T.sel=tkSel(T);tkVai(T,T.sel,false);
    /* troca de opção: anima do lugar onde a pílula ESTÁ (também no meio de outra troca ou depois de arrastar) */
    T.mo=new MutationObserver(function(){var i=tkSel(T);if(i===T.sel)return;T.sel=i;tkVai(T,i,true)});bs.forEach(function(b){T.mo.observe(b,{attributes:true,attributeFilter:['class']})});
    /* medida nova quando muda tamanho de tela, letra, idioma ou a fonte termina de carregar */
    var re=function(){if(!el.isConnected)return;tkMede(T);if(!T.drag)tkVai(T,T.sel,false)};
    if(window.ResizeObserver){T.ro=new ResizeObserver(re);T.ro.observe(el)}if(document.fonts&&document.fonts.ready)document.fonts.ready.then(re);
    /* arrastar com o dedo (ou mouse): a pílula segue o dedo e, ao soltar, fica na opção mais perto */
    var x0=0,y0=0,c0=null,moveu=0,pid=null;
    el.addEventListener('pointerdown',function(e){if(e.button>0||!T.c)return;pid=e.pointerId;x0=e.clientX;y0=e.clientY;c0={x:T.c.x,y:T.c.y,w:T.c.w,h:T.c.h};moveu=0;T.drag=0});
    el.addEventListener('pointermove',function(e){if(pid!==e.pointerId)return;var z=parseFloat(getComputedStyle(document.body).zoom)||1,dx=(e.clientX-x0)/z,dy=(e.clientY-y0)/z;
      if(!T.drag){if(Math.abs(dx)<7)return;if(Math.abs(dy)>Math.abs(dx)){pid=null;return}T.drag=1;moveu=1;cancelAnimationFrame(T.raf);try{el.setPointerCapture(pid)}catch(_){}}
      var L=T.m,x=Math.max(L[0].x,Math.min(L[L.length-1].x,c0.x+dx)),k=0;for(var i=0;i<L.length-1;i++)if(x>=L[i].x)k=i;var a=L[k],b=L[k+1]||a,f=b.x>a.x?(x-a.x)/(b.x-a.x):0;
      tkPoe(T,x,a.y+(b.y-a.y)*f,a.w+(b.w-a.w)*f,a.h+(b.h-a.h)*f)});
    var solta=function(e){if(pid!==e.pointerId)return;pid=null;if(!T.drag)return;T.drag=0;var cx=T.c.x+T.c.w/2,best=0,bd=1e9;T.m.forEach(function(m,i){var d=Math.abs(m.x+m.w/2-cx);if(d<bd){bd=d;best=i}});
      if(best!==T.sel){var b=tkBts(el)[best];if(b)b.click()}else tkVai(T,T.sel,true)};
    el.addEventListener('pointerup',solta);el.addEventListener('pointercancel',function(e){if(pid!==e.pointerId)return;pid=null;if(T.drag){T.drag=0;tkVai(T,T.sel,true)}});
    el.addEventListener('click',function(e){if(moveu&&e.isTrusted){moveu=0;e.preventDefault();e.stopImmediatePropagation()}},true);
    return T}
  window.__lfTrilho=lfTrilho;
  function tkMenu(){document.querySelectorAll('#drw .seg').forEach(function(s){var T=lfTrilho(s);if(T&&T.el.isConnected){tkMede(T);tkVai(T,tkSel(T),false)}})}
  /* o menu fica escondido até abrir: mede quando ele aparece */
  (function(){var d=document.getElementById('drw');if(!d)return;var f=function(){if(d.getBoundingClientRect().width>0)tkMenu()};new MutationObserver(function(){setTimeout(f,30)}).observe(d,{attributes:true,attributeFilter:['class','aria-hidden','hidden','style']});f()})();
  /* Minha conta: trocar de aba NÃO redesenha o trilho (a mesma pílula segue), o conteúdo antigo sai em 0,12 s e o novo entra do lado da aba tocada */
  var _mcTk=minhaConta;minhaConta=function(aba,edita){
    var pn0=document.querySelector('#layer [aria-label="Minha conta"]'),m0=pn0&&pn0.querySelector('.mct'),A0=st.mcAba,troca=!!(m0&&m0.__tk&&typeof aba==='string'&&aba!==A0&&edita==null),velho=[],de=-1,y0=0,sc0=0;
    if(troca){var k=0,bs0=tkBts(m0);de=tkSel(m0.__tk);[].slice.call(pn0.children).forEach(function(e){if(k)velho.push(e);if(e===m0)k=1});y0=m0.offsetTop+m0.offsetHeight;var scr0=pn0.closest('.scrim');sc0=pn0.scrollTop}
    window.__lfTk2=troca?1:0;var r;try{r=_mcTk.apply(this,arguments)}finally{window.__lfTk2=0}
    var pn=document.querySelector('#layer [aria-label="Minha conta"]'),m=pn&&pn.querySelector('.mct');if(!m)return r;
    if(troca&&m!==m0){var nb=tkBts(m),ob=tkBts(m0);if(nb.length===ob.length){
        var scN=pn.closest('.scrim');if(scN)scN.classList.add('mcLx');
        m.parentNode.replaceChild(m0,m);ob.forEach(function(b,i){var n=nb[i];b.className=n.className;b.setAttribute('aria-selected',n.getAttribute('aria-selected')||'false');b.textContent!==n.textContent&&(b.innerHTML=n.innerHTML)});m=m0;
        var para=tkSel(m0.__tk),s=para>de?1:-1,novo=[],k2=0;[].slice.call(pn.children).forEach(function(e){if(k2)novo.push(e);if(e===m0)k2=1});
        if(MOV()&&velho.length){if(getComputedStyle(pn).position==='static')pn.style.position='relative';
          var ov=document.createElement('div');ov.className='mcOld';ov.setAttribute('aria-hidden','true');ov.inert=true;ov.style.cssText='position:absolute;left:0;right:0;top:'+y0+'px;padding:0 '+getComputedStyle(pn).paddingRight+' 0 '+getComputedStyle(pn).paddingLeft+';box-sizing:border-box;pointer-events:none;z-index:3';
          velho.forEach(function(e){ov.appendChild(e)});pn.appendChild(ov);
          var a=ov.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateX('+(-14*s)+'px)'}],{duration:120,easing:'ease-out',fill:'forwards'});a.onfinish=function(){ov.remove()};setTimeout(function(){ov.remove()},400);
          novo.forEach(function(e){try{e.getAnimations().forEach(function(x){x.cancel()})}catch(_){}e.animate([{opacity:0,transform:'translateX('+(22*s)+'px)'},{opacity:1,transform:'none'}],{duration:320,delay:70,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})})}}}
    else{lfTrilho(m)}
    /* Cartões: o "Carregando…" troca para o conteúdo no mesmo lugar, cruzando (sem sumir seco) */
    var mt=pn.querySelector('#mtj');if(mt&&!mt.__mo&&MOV()){mt.__mo=new MutationObserver(function(){var h=mt.offsetHeight;[].forEach.call(mt.children,function(e){e.animate([{opacity:0},{opacity:1}],{duration:220,easing:'ease-out'})})});mt.__mo.observe(mt,{childList:true})}
    return r};
