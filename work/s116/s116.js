/* S116 (esboço, só na cópia de teste): Ajuda = Como comprar + Guia La Fouch + Dúvidas, com os componentes do próprio site */
(function(){
var WA='<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.6-.1 1.2z"/></svg>';
var BK='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
var F={preto:'/media/i/b0ce33cc336d.jpg',transp:'/media/i/b95b382e346d.jpg',hex:'/media/i/3c5853357cf4.jpg',verde:'/media/i/2c4d351d1f1c.jpg',arm:'/media/i/80f4857cb1cf.jpg',rosa:'/media/i/80f4857cb1cf.jpg'};
var G=[['Seu rosto','Qual óculos combina com o meu rosto?','1 min · com a câmera',F.preto],['Escolha certa','Leitura, armação ou solar: qual é a diferença?','2 min de leitura',F.transp],['Sol','UV400 e polarizado: qual é a diferença?','2 min de leitura',F.hex],['Cuidados','Como limpar seus óculos sem riscar','1 min de leitura',F.verde]];
var css=document.createElement('style');css.textContent=
'.s6 .seg{display:flex;width:100%;gap:2px;padding:3px;border:1px solid var(--ln);border-radius:999px;background:var(--pn);margin:4px 0 18px}'+
'.s6 .seg button{flex:1 1 0;border:0;background:transparent;color:var(--mu);font:700 13px Inter,system-ui,sans-serif;padding:9px 6px;border-radius:999px;min-height:40px;white-space:nowrap}.s6 .seg button.on{background:#a24a80;color:#fff}'+
'.s6 .rzp.f{background:color-mix(in srgb,var(--ac) 5%,var(--pn));padding:4px}.s6 .rzp.f img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}'+
'.s6 .rzn .tg{display:block;font:700 10.5px Inter,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--ac);margin-bottom:3px}'+
'.s6 .num{flex:none;width:34px;height:34px;border-radius:50%;border:1px solid var(--ln2);display:grid;place-items:center;font:600 15px Fraunces,Georgia,serif;color:var(--ac)}'+
'.s6 .rzr.st{cursor:default}.s6 .rzr.st .rzn b{font:700 15.5px Inter,system-ui,sans-serif}'+
'.s6 .dv{display:block;border-bottom:1px solid var(--ln)}.s6 .dv:last-child{border-bottom:0}.s6 .dv .rzr{border-bottom:0}.s6 .dv .rzn b{font:600 16px Fraunces,Georgia,serif}'+
'.s6 .dv .rzr>i{transition:transform .25s}.s6 .dv.on .rzr>i{transform:rotate(90deg)}.s6 .dv .ans{display:none;padding:0 16px 14px;font-size:14.5px;line-height:1.55;color:var(--mu)}.s6 .dv.on .ans{display:block}'+
'.s6 .pane{display:none}.s6 .pane.on{display:block}'+
'.s6 .whole{padding:22px;margin-top:26px;display:block}.s6 .whole h2{font:600 22px/1.2 Fraunces,Georgia,serif;margin:8px 0 6px}.s6 .whole .btn{margin-top:16px;width:100%}'+
'.s6 .ftx{display:block;color:var(--ac);font:600 14px Inter;margin:12px 2px 0}'+
'.s6.art .ph{border:1px solid var(--ln);border-radius:22px;background:#fff;aspect-ratio:16/9;display:flex;margin:6px 0 18px}.s6.art .ph img{flex:1;min-width:0;object-fit:contain}'+
'.s6.art p.tx{font-size:15.5px;line-height:1.65;color:#3a2e36;margin:0 0 12px}.s6.art .rzh{margin-top:20px}'+
'.s6.art .rzc{display:block}.s6.art .rzc small{display:block;font:700 10.5px Inter;letter-spacing:.14em;color:var(--ac)}.s6.art .rzc p{margin:6px 0 0;font-size:14.5px;line-height:1.55;color:var(--tx)}'+
'.s6 .hsh2{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 12px}.s6 .hsh2 a{color:var(--ac);font:600 14px Inter;text-decoration:none}';
document.head.appendChild(css);
function guiaRows(L){return '<div class="rzl">'+L.map(function(g){return '<button type="button" class="rzr" data-s6art><span class="rzp f"><img src="'+g[3]+'" alt=""></span><span class="rzn"><span class="tg">'+g[0]+'</span><b>'+g[1]+'</b><small>'+g[2]+'</small></span><i aria-hidden="true">›</i></button>'}).join('')+'</div>'}
var PASSOS=[['Escolha','Adicione ao carrinho os modelos que gostou.'],['Entre ou crie sua conta','É necessário para fazer o pedido.'],['Pedido e pagamento','PIX ou QR do banco. Fica reservado até a entrega.'],['Receba','Delivery no Paraguai. Outros países: retirada na loja.']];
var DUV=[['Como pago o pedido?','PIX (Brasil e Argentina) ou QR do banco (Paraguai), depois do pedido.'],['Até quando fica reservado?','Até a entrega ou retirada, depois do pagamento.'],['Fazem lentes com a minha receita?','Não. Só vendemos óculos de leitura prontos. Com receita, escolha uma armação e leve a uma ótica.'],['Posso trocar se não gostar?','Na retirada, sim, por outro modelo (pode haver ajuste de preço).']];
window.__s6aba=function(k){var c=document.getElementById('como');c.querySelectorAll('.seg button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-s6')===k)});c.querySelectorAll('.pane').forEach(function(p){p.classList.toggle('on',p.id==='s6'+k)})};
window.__s6ajuda=function(aba){var c=document.getElementById('como');
  c.innerHTML='<div class="rzm s6" style="padding:18px 20px 120px"><button type="button" class="navb vback rzb" data-vback>'+BK+'<span>Início</span></button><h2 class="rzt">Ajuda</h2><p class="rzs">Como comprar, guia e dúvidas.</p>'+
  '<div class="seg" role="tablist"><button type="button" data-s6="c" class="on">Como comprar</button><button type="button" data-s6="g">Guia La Fouch</button><button type="button" data-s6="d">Dúvidas</button></div>'+
  '<div class="pane on" id="s6c"><div class="rzl">'+PASSOS.map(function(p,i){return '<div class="rzr st"><span class="num">'+(i+1)+'</span><span class="rzn"><b>'+p[0]+'</b><small>'+p[1]+'</small></span></div>'}).join('')+'</div></div>'+
  '<div class="pane" id="s6g">'+guiaRows(G)+'</div>'+
  '<div class="pane" id="s6d"><div class="rzl">'+DUV.map(function(d,i){return '<div class="dv'+(i===0?' on':'')+'"><button type="button" class="rzr" data-s6dv><span class="rzn"><b>'+d[0]+'</b></span><i aria-hidden="true">›</i></button><div class="ans">'+d[1]+'</div></div>'}).join('')+'</div></div>'+
  '<div class="whole"><span class="eyebrow">Fale com a gente</span><h2>Ainda com dúvida?</h2><p>A loja responde pelo WhatsApp, de segunda a sábado.</p><a class="btn w">'+WA+'<span>Falar no WhatsApp</span></a></div></div>';
  __s6aba(aba||'c');c.scrollTop=0};
window.__s6artigo=function(){var c=document.getElementById('como'),cards=[].slice.call(document.querySelectorAll('main [data-open]')).filter(function(x){return x.querySelector('img')&&/R\$/.test(x.textContent)&&x.offsetWidth<240}).slice(0,2).map(function(x){return x.outerHTML}).join('');
  c.innerHTML='<div class="rzm s6 art" style="padding:18px 20px 120px"><button type="button" class="navb vback rzb">'+BK+'<span>Ajuda</span></button>'+
  '<div class="rzn" style="margin-top:10px"><span class="tg">Escolha certa</span></div><h2 class="rzt">Leitura, armação ou solar: qual é a diferença?</h2><p class="rzs">2 min de leitura</p>'+
  '<div class="ph"><img src="'+F.transp+'"><img src="'+F.arm+'"><img src="'+F.hex+'"></div>'+
  '<p class="tx">Na La Fouch você encontra três tipos de óculos. Cada um serve para uma coisa — vale conferir antes de comprar.</p>'+
  '<h3 class="rzh">Óculos de leitura</h3><p class="tx">Já vêm com lentes prontas, de +0.25 a +4.00, para enxergar de perto: ler, usar o celular, costurar.</p>'+
  '<h3 class="rzh">Armação</h3><p class="tx">É só a armação, sem grau. Para quem tem receita: leve a uma ótica e coloque as suas lentes.</p>'+
  '<h3 class="rzh">Solar</h3><p class="tx">Óculos de sol com proteção UV400, para o dia a dia.</p>'+
  '<div class="rzc"><small>IMPORTANTE</small><p>Só vendemos óculos de leitura prontos. Para miopia ou astigmatismo, escolha uma armação e leve a receita a uma ótica.</p></div>'+
  '<h3 class="rzh">Óculos para isso</h3><div class="hg" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+cards+'</div>'+
  '<h3 class="rzh">Leia também</h3>'+guiaRows([G[2]])+'</div>';c.scrollTop=0};
document.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('[data-s6],[data-s6dv]');if(!t)return;e.preventDefault();e.stopPropagation();
  if(t.hasAttribute('data-s6'))__s6aba(t.getAttribute('data-s6'));else{var d=t.parentNode,on=d.classList.contains('on');d.parentNode.querySelectorAll('.dv').forEach(function(x){x.classList.remove('on')});if(!on)d.classList.add('on')}},true);
/* Início: a seção do Guia passa a usar a mesma lista agrupada */
window.__s6inicio=function(){var h=document.getElementById('hguia');if(!h)return;var g=h.nextElementSibling;var w=document.createElement('div');w.className='s6';w.innerHTML='<div class="hsh2"><h2 class="h2" style="margin:0">Guia La Fouch</h2><a>Ver tudo ›</a></div>'+guiaRows(G.slice(0,3));
  h.replaceWith(w);if(g&&g.classList.contains('hgu'))g.remove()};
/* Menu: grupo AJUDA com as três entradas */
window.__s6menu=function(){var a=document.querySelector('#drw a[href="#como"]');if(!a)return;var mk=function(t){var x=a.cloneNode(true);x.childNodes[0].textContent=t;return x};
  var p=a.parentNode;p.insertBefore(mk('Como comprar'),a);p.insertBefore(mk('Guia La Fouch'),a);p.insertBefore(mk('Dúvidas frequentes'),a);a.remove()};
})();
