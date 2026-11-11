/* S126 (esboço, só na cópia de teste) — em cima do S124/S125 */
(function(){
var css=document.createElement('style');css.textContent=
'#como .s24 .meds{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:16px 0 14px}#como .s24 .med{background:var(--pn);border:1px solid var(--ln);border-radius:16px;padding:14px 6px 12px;display:flex;flex-direction:column;align-items:center;gap:6px}'+
'#como .s24 .med b{font:600 24px Fraunces,Georgia,serif;color:var(--tx);line-height:1}#como .s24 .med span{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--mu);font-weight:700}'+
'#como .s24 .pq p{margin:0 0 10px;font-size:15px;line-height:1.55;color:var(--mu)}#como .s24 .pq p b{color:var(--tx);font-weight:600}'+
'html.v5 .hnews.hn2.s26b{background:var(--hero)!important;border:1px solid var(--ln)!important;border-radius:26px!important;padding:28px 22px!important}html.v5 .hnews.hn2.s26b .nwb{background:var(--pn)!important}'+
'.s26cat{padding:0 4px}.s26cat .ch{display:flex;gap:8px;margin:8px 0 14px}.s26cat .ch span{border:1px solid var(--ln);border-radius:999px;padding:7px 14px;font:600 13.5px var(--body);color:var(--mu);background:var(--pn)}.s26cat .ch span.on{background:#a24a80;color:#fff;border-color:#a24a80}';
document.head.appendChild(css);
function cards(re,n){var vi={};
  return [].slice.call(document.querySelectorAll('#grid [data-open],main [data-open]')).filter(function(x){var r=x.getAttribute('data-open');if(vi[r]||!re.test(r)||!x.querySelector('img')||!/(R\$|Gs\.)/.test(x.textContent)||x.offsetWidth>260)return false;vi[r]=1;return true}).slice(0,n).map(function(x){
    var r=x.getAttribute('data-open'),t=(function(){var o=[],w=document.createTreeWalker(x,NodeFilter.SHOW_TEXT),nd;while(nd=w.nextNode()){var v=nd.textContent.trim();if(v)o.push(v)}return o})(),pr=t.filter(function(y){return /^(R\$|Gs\.)/.test(y)})[0]||'',ri=t.findIndex(function(y){return y.indexOf(r)===0});
    var mat='';for(var k=ri-1;k>=0;k--){if(!/^[A-ZÀ-Ú0-9 ]+$/.test(t[k])){mat=t[k].split('·')[0].trim();break}}
    var cor=(x.querySelector('i[style*=background]')||{style:{background:'#2a2d33'}}).style.background;
    return '<button type="button" class="hc" data-open="'+r+'"><span class="hci"><img src="'+x.querySelector('img').src+'" alt=""></span><span class="hn lfcod"><small class="hds">'+mat+'</small>'+r+'</span><span class="hsw"><i style="background:'+cor+'"></i></span><span class="hp">'+pr+'</span></button>'}).join('')}
function pg(tit,volta,corpo){var c=document.getElementById('como');c.innerHTML='<div class="ajw s24"><a href="#" class="ajbk" style="display:inline-flex">‹ '+volta+'</a><h2>'+tit+'</h2>'+corpo+'</div>';c.scrollTop=0}
var VC='<a class="vl">Ver catálogo ›</a>';
window.__s26inicio=function(){var w=document.querySelector('.s24i');if(!w)return;w.querySelector('h2').textContent='Comece por aqui';
  var T=[['TESTE DE LEITURA','Descubra seu grau em 1 min',''],['ESTILO','A armação ideal para o seu rosto',''],['AJUDA','Tire suas dúvidas','Pagamento, entrega e troca']];
  w.querySelectorAll('.hgu button').forEach(function(b,i){var t=T[i];if(!t)return;b.querySelector('small').textContent=t[0];b.querySelector('b').textContent=t[1];b.querySelectorAll('p,.gt>:not(small):not(b)').forEach(function(x){x.remove()});if(t[2]){var s=document.createElement('p');s.style.cssText='display:block!important;margin:4px 0 0;color:var(--mu);font-size:13.5px';s.textContent=t[2];b.querySelector('.gt').appendChild(s)}})};
window.__s26escolha=function(){pg('Leitura, armação ou solar?','Dicas e cuidados',
  '<div class="art"><span class="ey">ESCOLHA CERTA · 2 min de leitura</span>'+
  '<div class="bl"><span class="ey">LEITURA</span><h3>Para ler de perto</h3><p class="tx">Lentes prontas, de +0.25 a +4.00. Você escolhe o grau e leva na hora.</p><div class="vit"><div class="gr">'+cards(/^GR33(40|45)/,2)+'</div>'+VC+'</div></div>'+
  '<div class="bl"><span class="ey">ARMAÇÃO</span><h3>Para a sua receita</h3><p class="tx">Só a armação, sem grau. Leve a uma ótica e coloque as suas lentes.</p><div class="vit"><div class="gr">'+cards(/^(AC|BR)/,2)+'</div>'+VC+'</div></div>'+
  '<div class="bl"><span class="ey">SOLAR</span><h3>Para o sol do dia a dia</h3><p class="tx">Proteção UV400, que bloqueia praticamente todo o UV.</p><div class="vit"><div class="gr">'+cards(/^SL/,2)+'</div>'+VC+'</div></div></div>')};
window.__s26cuidados=function(){pg('Como limpar seus óculos sem riscar','Dicas e cuidados',
  '<div class="art"><span class="ey">CUIDADOS · 1 min de leitura</span>'+
  '<div class="meds"><div class="med"><b>1</b><span>Enxágue</span></div><div class="med"><b>2</b><span>Lave</span></div><div class="med"><b>3</b><span>Seque</span></div></div>'+
  '<div class="pq"><p><b>1 · </b>Água corrente, para tirar a poeira antes de esfregar.</p><p><b>2 · </b>Uma gota de detergente neutro, dos dois lados da lente.</p><p><b>3 · </b>Seque com a flanela de microfibra, nunca com papel ou roupa.</p></div>'+
  '<div class="bl" style="padding-top:26px"><span class="ey">HORA DE TROCAR?</span><h3>Lente riscada ou armação gasta?</h3><div class="vit"><div class="gr">'+cards(/^GR33(40|45)/,2)+cards(/^(AC|BR)/,2)+'</div>'+VC+'</div></div>'+
  '<p class="presente">Todo óculos vai com estojo e flanela de microfibra de presente.</p></div>')};
/* o que abre ao tocar "Ver catálogo" no Hora de trocar: leitura e armações juntas */
window.__s26catalogo=function(){var c=document.getElementById('como');c.innerHTML='<div class="ajw s24 s26cat"><a class="ajbk" style="display:inline-flex">‹ Como limpar</a><h2>Leitura e armações</h2><div class="ch"><span>Todos</span><span class="on">Leitura e armações</span></div><div class="gr" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+cards(/^(GR33(40|45)|AC|BR)/,8)+'</div></div>';c.scrollTop=0};
window.__s26novidades=function(op){var n=document.querySelector('.hnews.hn2');if(n)n.classList.toggle('s26b',op==='B')};
})();
