/* S125 (esboço, só na cópia de teste) — em cima do S124 */
(function(){
var css=document.createElement('style');css.textContent=
'#como .s24 .vit{margin:10px 0 6px}#como .s24 .vit .gr{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}'+
'#como .s24 .vl{display:block;text-align:right;color:var(--ac);font:600 14px var(--body);margin:12px 2px 4px;text-decoration:none}'+
'#como .s24 .bl{padding:22px 0 18px;border-top:1px solid var(--ln)}#como .s24 .bl:first-of-type{border-top:0}'+
'#como .s24 .bl .ey{margin:0 0 4px}#como .s24 .bl h3{margin:0 0 6px}'+
'#como .s24 .presente{font-size:13.5px;color:var(--mu);text-align:center;margin:18px 0 0}'+
'.s24i .hgu .gt small{letter-spacing:.06em}';
document.head.appendChild(css);
function cards(re,n){var vi={};return [].slice.call(document.querySelectorAll('#grid [data-open],main [data-open]')).filter(function(x){var r=x.getAttribute('data-open');if(vi[r]||!re.test(r)||!x.querySelector('img')||!/R\$/.test(x.textContent)||x.offsetWidth>260)return false;vi[r]=1;return true}).slice(0,n).map(function(x){var c=x.cloneNode(true),m=document.querySelector('main .hg [data-open]')||document.querySelector('main [data-open]');if(m&&m!==x)c.className=m.className;c.removeAttribute('style');c.querySelectorAll('.fav,.stk').forEach(function(f){f.remove()});return c.outerHTML}).join('')}
window.__s25guarda=function(){var g=document.getElementById('grid');window.__s25g=g?g.innerHTML:''};
function C(re){return cards(re,2)}
function pg(tit,volta,corpo,sub){var c=document.getElementById('como');c.innerHTML='<div class="ajw s24"><a href="#" class="ajbk" style="display:inline-flex">‹ '+volta+'</a><h2>'+tit+'</h2>'+(sub?'<p class="sub">'+sub+'</p>':'')+corpo+'</div>';c.scrollTop=0}
/* 1 · Início mais enxuto: rótulo + título curto, sem a linha de baixo */
window.__s25inicio=function(){var w=document.querySelector('.s24i');if(!w)return;w.querySelector('h2').textContent='Comece por aqui';
  var T=[['TESTE DE LEITURA · 1 MIN','Descubra o seu grau'],['FORMATO DO ROSTO','O óculos certo para você'],['AJUDA','Compra, entrega e troca']];
  w.querySelectorAll('.hgu button').forEach(function(b,i){var t=T[i];if(!t)return;b.querySelector('small').textContent=t[0];b.querySelector('b').textContent=t[1];b.querySelectorAll('p,.gt>:not(small):not(b)').forEach(function(x){x.remove()})})};
/* 2 · Leitura, armação ou solar — uma vitrine por categoria */
window.__s25escolha=function(){pg('Leitura, armação ou solar?','Dicas e cuidados',
  '<div class="art"><span class="ey">ESCOLHA CERTA · 2 min de leitura</span>'+
  '<div class="bl"><span class="ey">LEITURA</span><h3>Para ler de perto</h3><p class="tx">Lentes prontas, de +0.25 a +4.00. Você escolhe o grau e leva na hora.</p><div class="vit"><div class="gr">'+C(/^GR33(40|45)/)+'</div><a class="vl">Ver os de leitura ›</a><a class="vl" style="margin-top:2px">Não sabe o seu grau? Faça o teste ›</a></div></div>'+
  '<div class="bl"><span class="ey">ARMAÇÃO</span><h3>Para a sua receita</h3><p class="tx">Só a armação, sem grau. Leve a uma ótica e coloque as suas lentes.</p><div class="vit"><div class="gr">'+C(/^(AC|BR)/)+'</div><a class="vl">Ver as armações ›</a></div></div>'+
  '<div class="bl"><span class="ey">SOLAR</span><h3>Para o sol do dia a dia</h3><p class="tx">Proteção UV400, que bloqueia praticamente todo o UV.</p><div class="vit"><div class="gr">'+C(/^SL/)+'</div><a class="vl">Ver os solares ›</a></div></div></div>')};
/* 3 · Cuidados — termina vendendo leitura e armação */
window.__s25cuidados=function(){pg('Como limpar seus óculos sem riscar','Dicas e cuidados',
  '<div class="art"><span class="ey">CUIDADOS · 1 min de leitura</span><div class="pas" style="margin-top:14px">'+
  [['Enxágue','Água corrente, para tirar a poeira antes de esfregar.'],['Lave','Uma gota de detergente neutro, dos dois lados.'],['Seque','Com a flanela, sem papel nem roupa.']].map(function(p,i){return '<div><span class="ajn">'+(i+1)+'</span><span><b>'+p[0]+'</b><span>'+p[1]+'</span></span></div>'}).join('')+'</div>'+
  '<div class="bl" style="border-top:0;padding-top:30px"><span class="ey">HORA DE TROCAR?</span><h3>Lente riscada ou armação gasta?</h3><div class="vit"><div class="gr">'+C(/^GR33(40|45)/)+C(/^(AC|BR)/)+'</div><a class="vl">Ver os de leitura ›</a><a class="vl" style="margin-top:2px">Ver as armações ›</a></div></div>'+
  '<p class="presente">Todo óculos vai com estojo e flanela de presente.</p></div>')};
/* 4 · Rodapé: três opções no padrão (título curto + links simples) */
window.__s25rodape=function(op){var f=document.querySelector('.lfft .in');if(!f)return;if(!window.__s25f)window.__s25f=f.innerHTML;f.innerHTML=window.__s25f;
  var col=function(t,L){return '<div><b>'+t+'</b>'+L.map(function(x){return '<p><a>'+x+'</a></p>'}).join('')+'</div>'};
  var cols=f.children,first=cols[0].outerHTML,comprar=[].slice.call(cols).filter(function(c){return /Comprar/.test(c.textContent)})[0].outerHTML;
  var aj=['Como comprar','Dúvidas frequentes','Dicas e cuidados'];
  if(op==='A')f.innerHTML=first+comprar+col('Ajuda',aj)+col('Contato',['Entre em contato','WhatsApp','Como chegar']);
  if(op==='B')f.innerHTML=first+comprar+col('Ajuda',aj.concat(['Entre em contato']));
  if(op==='C')f.innerHTML=first+comprar+col('Ajuda',aj)+'<div><b>Fale conosco</b><p><a>Escreva para a loja</a></p><p><a>WhatsApp</a></p><p>Seg. a sáb., 7h30 às 15h</p></div>'};
})();
