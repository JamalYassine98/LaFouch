/* S144 esboço PC (só na cópia de teste) */
(function(){
var W=1320;
var css=document.createElement('style');css.textContent=
'@media (min-width:1100px){'+
/* 1 largura só */
'html.v5 body .top .bar,html.v5 body #home,html.v5 body #vitrine,html.v5 body #como{max-width:'+W+'px!important;width:min('+W+'px,92vw)!important;margin-left:auto!important;margin-right:auto!important}'+
'html.v5 body #home>*{max-width:none!important;width:100%!important}'+
/* cabeçalho de PC */
'html.v5 body .top .bar{display:flex!important;align-items:center;gap:28px;height:76px;padding:0!important}'+
'html.v5 body .top #mnb{display:none!important}'+
'html.v5 body .top .bar a.logo.logo{position:relative!important;left:auto!important;right:auto!important;top:auto!important;transform:none!important;margin:0 10px 0 0!important;order:-2!important;flex:none;width:110px!important;background-position:left center!important}'+'html.v5 body .top .bar .nav.nav{order:-1!important}'+'html.v5 body #home{padding-left:0!important;padding-right:0!important}'+
'html.v5 body .top .nav{display:flex!important;gap:26px;order:1}html.v5 body .top .nav a{font:500 15px var(--body);color:var(--tx);text-decoration:none;padding:6px 0;border-bottom:1.5px solid transparent}html.v5 body .top .nav a:hover,html.v5 body .top .nav a.on{border-color:var(--ac);color:var(--ac)}'+
'html.v5 body .top .grow{order:2;flex:1}'+
'html.v5 body .top .bar label.search.search{display:flex!important;position:static!important;order:3;align-items:center;gap:8px;height:42px;width:300px;padding:0 16px;border:1px solid var(--ln);border-radius:999px;background:#fff;color:var(--mu)}html.v5 body .top .bar label.search input{display:block!important;border:0;outline:0;background:none;font:400 14px var(--body);width:100%;color:var(--tx)}'+
'html.v5 body .top .bar>.ib{order:4}'+
/* grades */
'html.v5 body #home .hd{min-height:420px}'+
'html.v5 body #home .hgu.s44a{display:block}'+
'.s44a .card{display:grid;grid-template-columns:1.1fr 1fr;border:1px solid var(--ln);border-radius:22px;overflow:hidden;background:var(--pn,#fff)}'+
'.s44a .card .im{background:linear-gradient(135deg,color-mix(in srgb,#a2447c 7%,#fff),#fff);display:grid;grid-template-columns:repeat(3,1fr);align-items:center;padding:30px 24px;gap:10px}.s44a .card .im img{width:100%;mix-blend-mode:multiply}'+
'.s44a .card .tx{padding:44px 48px;display:flex;flex-direction:column;justify-content:center}.s44a small{font:700 12px var(--body);letter-spacing:.14em;color:#a2447c}.s44a h3{font:400 34px/1.15 var(--display);margin:10px 0 10px;color:var(--tx)}.s44a p{margin:0 0 26px!important;color:var(--mu);font-size:16px;line-height:1.55;max-width:420px}'+
'.s44a .bt{align-self:flex-start;display:inline-flex;align-items:center;height:50px;padding:0 30px;border-radius:999px;background:#8d3a69;color:#fff;font:600 15px var(--body);border:0}'+
'html.v5 body #home .hgu.s44g{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:18px!important}html.v5 body #home .hgu.s44g>button{width:auto!important}html.v5 body #home .hgu.s44g>button{display:flex!important;flex-direction:column!important;align-items:stretch!important;padding:0!important;text-align:left}html.v5 body #home .hgu.s44g .gi{display:block!important;aspect-ratio:4/3!important;height:auto!important;margin:0!important;padding:0!important;overflow:hidden}html.v5 body #home .hgu.s44g .gi img{display:block;width:100%!important;height:100%!important;object-fit:cover!important;margin:0!important;transform:none!important}html.v5 body #home .hgu.s44g .gt{display:block!important;padding:16px 18px 20px!important;margin:0!important}'+
'}';
document.head.appendChild(css);
/* zoom proporcional acima de 1920 */
function z(){if(innerWidth<1100)return;var k=innerWidth>1920?+(innerWidth/1920).toFixed(3):1;document.body.style.zoom=k;document.body.style.setProperty('--z',k)}z();addEventListener('resize',z);
window.__s44=function(){
  var n=document.querySelector('.top .nav');if(n)n.innerHTML='<a href="#vitrine">Solar</a><a href="#vitrine">Leitura</a><a href="#vitrine">Armações</a><a href="#vitrine">Ofertas</a><a href="#atacado">Atacado</a><a href="#como">Ajuda</a>';
  document.querySelectorAll('.top .bar button').forEach(function(b){var l=(b.getAttribute('aria-label')||'')+b.id;if(/busca|Buscar|search|srch/i.test(l))b.style.setProperty('display','none','important')});
  var q=document.getElementById('q');if(q)q.placeholder='Buscar modelo ou referência';
  var g=document.querySelectorAll('#home .hgu');
  if(g[0]&&innerWidth>=1100){var im=[...document.querySelectorAll('#home .hg img')].slice(0,3).map(function(i){return '<img src="'+i.getAttribute('src')+'">'}).join('');
    g[0].classList.add('s44a');g[0].innerHTML='<div class="card"><div class="im">'+im+'</div><div class="tx"><small>PARA REVENDER</small><h3>Compre em quantidade</h3><p>Preços especiais para lojas, revendedores e empresas, com atendimento exclusivo.</p><button class="bt" type="button">Solicitar orçamento</button></div></div>'}
  if(g[1])g[1].classList.add('s44g');
  /* WhatsApp na borda do conteúdo */
  var wa=document.querySelector('.wa');if(wa&&innerWidth>=1100){var zz=parseFloat(document.body.style.zoom)||1,vw=innerWidth/zz,cw=Math.min(W,vw*.92);wa.style.setProperty('right',Math.max(16,(vw-cw)/2-70)+'px','important')}
};
})();
