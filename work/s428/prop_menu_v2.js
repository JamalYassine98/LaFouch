/* S428 esboço MENU v2 (dono 18/11 22:41), por cima do menu estilo Apple (prop_menu_apple.js). Duas variantes pela porta:
   8001 = EVOLUÇÃO: no topo só o logo e o × com o menu aberto; uma letra só (serifada) e 3 tamanhos (26 categorias · 18 itens · 14 pequeno);
          espaços da escala 8/16/24/32/48; cartão da conta como aprovado (A).
   8002 = VITRINE: a evolução + foto pequena de uma peça REAL de cada categoria ao lado do nome (tirada do "Compre por categoria" do início);
          ferramentas e ajuda em 2 colunas de texto pequeno, sem setas. */
(function(){
  var V=location.port==='8002'?'vit':'evo';
  var css=''+
  'html.lfap body .top #contabtn,html.lfap body .top #sbtn,html.lfap body .top #bagbtn,html.lfap body .top .cnt,html.lfap body .top [data-cart]{visibility:hidden!important}'+
  'html body #drw.lfap.lfap.lfap .dnv>.dch{gap:24px!important;margin:8px 0 24px!important}'+
  'html body #drw.lfap.lfap.lfap .dnv>.dch a{font:500 14px var(--display),Georgia,serif!important;letter-spacing:.01em}'+
  'html body #drw.lfap.lfap.lfap .dnv>a:not(.dacc){font-size:18px!important;padding:12px 0!important}'+
  'html body #drw.lfap.lfap.lfap .dnv>a[data-mf^="tipo:"]{font-size:26px!important;padding:8px 0!important}'+
  'html body #drw.lfap.lfap.lfap .dnv>small.dgl{height:24px!important}'+
  'html body #drw.lfap.lfap.lfap #dset.dset>button{font:500 14px var(--display),Georgia,serif!important}'+
  'html body #drw.lfap.lfap.lfap .dct{font-family:var(--display),Georgia,serif!important}';
  if(V==='vit')css+=''+
  'html body #drw.lfap.lfap.lfap .dnv>a[data-mf^="tipo:"]{min-height:72px!important;padding:8px 0!important}'+
  'html body #drw.lfap.lfap.lfap .dnv>a[data-mf^="tipo:"]:after{display:none!important}'+
  'html body #drw.lfap.lfap.lfap .dnv>a[data-mf^="tipo:"] .lfvi{width:96px;height:56px;object-fit:contain;mix-blend-mode:multiply;flex:none}'+
  'html body #drw.lfap.lfap.lfap .lfv2{display:grid;grid-template-columns:1fr 1fr;gap:0 16px;margin:8px 0 0}'+
  'html body #drw.lfap.lfap.lfap .lfv2>a{border:0!important;padding:12px 0!important;min-height:44px;display:flex!important;align-items:center;font:500 15px var(--display),Georgia,serif!important;color:var(--tx)!important}'+
  'html body #drw.lfap.lfap.lfap .lfv2>a:after{display:none!important}'+
  'html body #drw.lfap.lfap.lfap .dnv>small.lfv2h{display:none!important}';
  var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);
  function foto(tipo){var mapa={'tipo:solar':0,'tipo:grau':1,'tipo:armacao':2};var cats=[].slice.call(document.querySelectorAll('#home .hcat a img'));
    if(tipo in mapa&&cats[mapa[tipo]])return cats[mapa[tipo]].currentSrc||cats[mapa[tipo]].src;var h=document.querySelector('#hdst img,#home .hc img');return h?(h.currentSrc||h.src):''}
  function vit(){if(V!=='vit')return;var n=document.querySelector('#drw .dnv');if(!n||n.__lfv)return;n.__lfv=1;
    [].slice.call(n.querySelectorAll(':scope>a[data-mf^="tipo:"]')).forEach(function(a){var u=foto(a.getAttribute('data-mf'));if(!u)return;var i=document.createElement('img');i.className='lfvi';i.alt='';i.src=u;a.appendChild(i)});
    var sec=[].slice.call(n.querySelectorAll(':scope>a:not(.dacc):not([data-mf])'));if(!sec.length)return;var g=document.createElement('div');g.className='lfv2';sec[0].parentNode.insertBefore(g,sec[0]);sec.forEach(function(a){g.appendChild(a)});
    [].slice.call(n.querySelectorAll(':scope>small.dgl')).forEach(function(l,i){if(i>0)l.classList.add('lfv2h')})}
  var t=0;new MutationObserver(function(){if(t)return;t=requestAnimationFrame(function(){t=0;vit()})}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});vit();
})();
