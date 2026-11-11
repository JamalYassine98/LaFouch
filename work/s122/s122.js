/* S122 (esboço, só na cópia de teste): Guia La Fouch numa página só, com o mínimo de toques, usando os componentes do site */
(function(){
var BK='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
var css=document.createElement('style');css.textContent=
'.s22 .rzh{font:600 22px Fraunces,Georgia,serif;margin:28px 0 12px}'+
'.s22 .mch{display:flex;gap:14px;align-items:center;padding:14px 16px;border:1px solid var(--ln);border-radius:22px;background:linear-gradient(160deg,var(--pn),color-mix(in srgb,var(--ac) 6%,var(--pn)));text-align:left;width:100%;color:inherit;cursor:pointer}'+
'.s22 .mch img{flex:none;width:78px}.s22 .mch small{display:block;font:700 10.5px Inter,system-ui,sans-serif;letter-spacing:.14em;color:var(--ac)}.s22 .mch b{display:block;font:600 19px/1.2 Fraunces,Georgia,serif;color:var(--tx);margin:4px 0 8px}'+
'.s22 .lk{color:var(--ac);font:600 14px Inter,system-ui,sans-serif}'+
'.s22 .pas{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--ln);border-radius:22px;background:var(--pn);overflow:hidden}'+
'.s22 .pas>div{padding:16px 14px 16px;display:flex;flex-direction:column;gap:6px}.s22 .pas>div:nth-child(odd){border-right:1px solid var(--ln)}.s22 .pas>div:nth-child(-n+2){border-bottom:1px solid var(--ln)}'+
'.s22 .pas .n{width:28px;height:28px;border-radius:50%;border:1px solid var(--ln2);display:grid;place-items:center;font:600 14px Fraunces,Georgia,serif;color:var(--ac)}'+
'.s22 .pas b{font:600 17px Fraunces,Georgia,serif;color:var(--tx)}.s22 .pas span{font-size:13px;line-height:1.45;color:var(--mu)}'+
'.s22 .nt{font-size:13px;color:var(--mu);line-height:1.5;margin:12px 4px 0}'+
'.s22 .hgu{display:flex;flex-direction:column;gap:12px}'+
'.s22 .ct{background:var(--hero);border:1px solid var(--ln);border-radius:26px;padding:22px;margin-top:30px}.s22 .ct h2{font:600 23px/1.2 Fraunces,Georgia,serif;margin:8px 0 6px;text-align:left}.s22 .ct h2::after{display:none}.s22 .ct p{color:var(--mu);margin:0 0 16px;font-size:14px}'+
'.s22 .ct .field{display:block;width:100%;margin:0 0 10px;flex:none}.s22 .ct textarea.field{height:108px;padding:12px 14px;resize:none}'+
'.s22 .ct .btn{width:100%;margin-top:6px}.s22 .ct small.pv{display:block;font-size:11.5px;color:var(--mu);margin-top:10px;text-align:center}'+
'.s22 .ok{text-align:center;padding:18px 6px}.s22 .ok .ck{width:46px;height:46px;border-radius:50%;border:1px solid var(--ln2);display:grid;place-items:center;margin:0 auto 12px;color:var(--ac);font-size:22px;background:var(--pn)}'+
'.s22.art p.tx{font-size:15.5px;line-height:1.65;color:#3a2e36;margin:0 0 12px}.s22.art .ph{border:1px solid var(--ln);border-radius:22px;background:#fff;aspect-ratio:16/9;display:flex;margin:6px 0 18px}.s22.art .ph img{flex:1;min-width:0;object-fit:contain}'+
'.s22 .ey{display:block;font:700 10.5px Inter,system-ui,sans-serif;letter-spacing:.14em;color:var(--ac);text-transform:uppercase;margin-top:10px}'+
'.s22 .ver{display:block;text-align:right;color:var(--ac);font:600 14.5px Inter;margin:14px 4px 0}';
document.head.appendChild(css);
/* os cartões do Guia são os MESMOS do Início (copiados do próprio site), sem o de Atacado */
function cartoes(){var L=[].slice.call(document.querySelectorAll('.hgu button')).filter(function(b){return !/atacado/i.test(b.textContent)});
  return '<div class="hgu">'+L.map(function(b){var c=b.cloneNode(true);c.querySelectorAll('p,.gs,.gt>:not(small):not(b)').forEach(function(x){x.remove()});return c.outerHTML}).join('')+'</div>'}
var CART=null;
var MOCHI='<button type="button" class="mch" data-gzopen><img src="/media/mochi_esboco.png" alt=""><span><small>COM VOZ · 1 MIN</small><b>Descubra o seu grau</b><span class="lk">Começar o teste ›</span></span></button>';
var PASSOS='<h3 class="rzh">Como comprar</h3><div class="pas">'+
 [['Escolha','Adicione ao carrinho.'],['Entre','Crie sua conta em 1 minuto.'],['Pague','PIX ou QR do banco. O pedido fica reservado.'],['Receba','Delivery no Paraguai ou retirada em CDE. Troca na retirada.']]
 .map(function(p,i){return '<div><span class="n">'+(i+1)+'</span><b>'+p[0]+'</b><span>'+p[1]+'</span></div>'}).join('')+'</div>'+
 '<p class="nt">Só vendemos óculos de leitura prontos. Com receita, escolha uma armação e leve a uma ótica.</p>';
var FORM='<div class="ct" id="s22ct"><span class="eyebrow">Fale com a gente</span><h2>Entre em contato conosco</h2><p>Respondemos no seu e-mail, de segunda a sábado.</p>'+
 '<input class="field" placeholder="Nome completo"><input class="field" placeholder="E-mail" type="email"><input class="field" placeholder="Telefone (+595 …)"><textarea class="field" placeholder="Sua mensagem"></textarea>'+
 '<a class="btn p">Enviar</a><small class="pv">Usamos seus dados só para responder.</small></div>';
window.__s22pagina=function(){CART=CART||cartoes();var c=document.getElementById('como');
  c.innerHTML='<div class="rzm s22" style="padding:18px 20px 120px"><button type="button" class="navb vback rzb" data-vback>'+BK+'<span>Início</span></button><h2 class="rzt">Guia La Fouch</h2><p class="rzs">Tudo para escolher, comprar e cuidar do seu óculos.</p>'+
  MOCHI+PASSOS+'<h3 class="rzh">Para escolher e cuidar</h3>'+CART+FORM+'</div>';c.scrollTop=0};
window.__s22enviado=function(){var f=document.getElementById('s22ct');if(f)f.innerHTML='<div class="ok"><div class="ck">✓</div><h2 style="text-align:center">Mensagem enviada</h2><p style="margin:0">Recebemos sua mensagem e respondemos em breve no seu e-mail.</p></div>'};
window.__s22inicio=function(){CART=CART||cartoes();var h=document.getElementById('hguia');if(!h)return;var g=h.nextElementSibling;var w=document.createElement('div');w.className='s22';
  w.innerHTML='<h2 class="h2" style="margin:0 0 14px">Guia La Fouch</h2>'+MOCHI+'<div style="height:12px"></div>'+CART+'<a class="ver">Ver o guia completo ›</a>';h.replaceWith(w);if(g&&g.classList.contains('hgu'))g.remove()};
window.__s22menu=function(){var a=document.querySelector('#drw a[href="#como"]');if(a)a.firstChild.textContent='Guia La Fouch'};
window.__s22artigo=function(){CART=CART||cartoes();var c=document.getElementById('como'),pr=[].slice.call(document.querySelectorAll('main [data-open]')).filter(function(x){return x.querySelector('img')&&/R\$/.test(x.textContent)&&x.offsetWidth<240}).slice(0,2).map(function(x){return x.outerHTML}).join('');
  var tmp=document.createElement('div');tmp.innerHTML=CART;tmp.querySelectorAll('button').forEach(function(b){if(/armação ou solar/.test(b.textContent))b.remove()});var outros=tmp.innerHTML;
  c.innerHTML='<div class="rzm s22 art" style="padding:18px 20px 120px"><button type="button" class="navb vback rzb">'+BK+'<span>Guia</span></button><span class="ey">Escolha certa</span><h2 class="rzt" style="margin-top:6px">Leitura, armação ou solar: qual é a diferença?</h2><p class="rzs">2 min de leitura</p>'+
  '<div class="ph"><img src="/media/i/b95b382e346d.jpg"><img src="/media/i/80f4857cb1cf.jpg"><img src="/media/i/3c5853357cf4.jpg"></div>'+
  '<p class="tx">Na La Fouch você encontra três tipos de óculos. Cada um serve para uma coisa — vale conferir antes de comprar.</p>'+
  '<h3 class="rzh">Óculos de leitura</h3><p class="tx">Já vêm com lentes prontas, de +0.25 a +4.00, para enxergar de perto.</p><h3 class="rzh">Armação</h3><p class="tx">Só a armação, sem grau. Com receita, leve a uma ótica.</p><h3 class="rzh">Solar</h3><p class="tx">Óculos de sol com proteção UV400.</p>'+
  '<h3 class="rzh">Óculos para isso</h3><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+pr+'</div><h3 class="rzh">Continue lendo</h3>'+outros+'</div>';c.scrollTop=0};
})();
