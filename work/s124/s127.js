/* S127 (esboço, só na cópia de teste) */
(function(){
var css=document.createElement('style');css.textContent=
/* A+: a mesma faixa entre linhas, com um brilho quase imperceptível (sem caixa, sem borda, sem canto) */
'html.v5 .hnews.hn2.s27{background:radial-gradient(120% 90% at 50% 50%,color-mix(in srgb,var(--ac) 7%,var(--bg)) 0%,var(--bg) 72%)!important}'+
'#como .s24 .cu p{margin:0 0 14px;font-size:15.5px;line-height:1.6;color:var(--mu)}#como .s24 .cu p b{display:block;color:var(--tx);font-weight:600;font-size:16px;margin-bottom:2px}'+
/* Atacado: cartão próprio, forte, no padrão dos cartões do site */
'.s27a{border:1px solid var(--ln);border-radius:22px;background:var(--pn);overflow:hidden}'+
'.s27a .fx{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;background:linear-gradient(135deg,color-mix(in srgb,var(--ac) 8%,#fff),#fff)}.s27a .fx span{aspect-ratio:1;display:grid;place-items:center}.s27a .fx img{width:88%;mix-blend-mode:multiply}'+
'.s27a .tx{padding:18px 18px 20px}.s27a small{font:700 11.5px var(--body);letter-spacing:.14em;color:var(--ac)}.s27a h3{font:500 24px/1.15 var(--display);margin:8px 0 6px;color:var(--tx)}.s27a p{margin:0 0 6px;color:var(--mu);font-size:14.5px;line-height:1.5}'+
'.s27a .mk{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 16px}.s27a .mk span{border:1px solid var(--ln);border-radius:999px;padding:6px 12px;font:600 12.5px var(--body);color:var(--tx);background:var(--bg)}'+
'.s27a .btn{width:100%;min-height:50px}';
document.head.appendChild(css);
window.__s27novidades=function(){var n=document.querySelector('.hnews.hn2');if(n){n.classList.remove('s26b');n.classList.add('s27')}};
function pg(tit,volta,corpo){var c=document.getElementById('como');c.innerHTML='<div class="ajw s24"><a href="#" class="ajbk" style="display:inline-flex">‹ '+volta+'</a><h2>'+tit+'</h2>'+corpo+'</div>';c.scrollTop=0}
window.__s27cuidados=function(){var tmp=document.createElement('div');window.__s26cuidados();var c=document.getElementById('como');
  var g=c.querySelector('.bl');var gh=g?g.outerHTML:'';
  pg('Como limpar seus óculos sem riscar','Dicas e cuidados','<div class="art"><span class="ey">CUIDADOS · 1 min de leitura</span><div class="cu" style="margin-top:16px">'+
   '<p><b>Enxágue</b>Em água corrente, para tirar a poeira antes de esfregar.</p><p><b>Lave</b>Com uma gota de detergente neutro, dos dois lados da lente.</p><p><b>Seque</b>Com a flanela de microfibra, nunca com papel ou roupa.</p></div>'+gh+'</div>')};
window.__s27semBrinde=function(){document.querySelectorAll('#layer .pbr').forEach(function(e){e.remove()})};
window.__s27atacado=function(){var h=document.getElementById('hloj');if(!h)return;var g=h.nextElementSibling;
  var fotos=[].slice.call(document.querySelectorAll('#grid [data-open],main [data-open]')).filter(function(x){return /^(BR|AC)/.test(x.getAttribute('data-open'))&&x.querySelector('img')}).map(function(x){return x.querySelector('img').src}).filter(function(u,i,a){return a.indexOf(u)===i}).slice(0,3);
  var w=document.createElement('div');w.innerHTML='<div class="hsh"><h2 class="h2">Atacado</h2></div><div class="s27a"><div class="fx">'+fotos.map(function(u){return '<span><img src="'+u+'" alt=""></span>'}).join('')+'</div><div class="tx"><small>PARA REVENDER</small><h3>Compre em quantidade</h3><p>Preços especiais para lojas, revendedores e empresas. Pedido mínimo e prazos combinados direto com a loja.</p><div class="mk"><span>Kazwini · só no atacado</span><span>Todas as linhas</span></div><a class="btn o">Ver preços de atacado</a></div></div>';
  h.replaceWith(w);if(g&&g.classList.contains('hgu'))g.remove()};
})();
