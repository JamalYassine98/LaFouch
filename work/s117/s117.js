/* S117 (esboço, só na cópia de teste): o Guia La Fouch é a página de ajuda — o mesmo bloco no Início e no menu,
   dividido pelo momento do cliente; o Mochi é o único destaque; cada informação num lugar só */
(function(){
var BK='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>';
var WA='<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 .9c.3.1.5.2.5.3.1.2.1.6-.1 1.2z"/></svg>';
var css=document.createElement('style');css.textContent=
'.s7 .rzp.f{background:color-mix(in srgb,var(--ac) 5%,var(--pn));padding:4px;align-items:center;justify-content:center}.s7 .rzp.f img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}'+
'.s7 .rzp.ic{align-items:center;justify-content:center;color:var(--ac)}.s7 .rzp.ic svg{width:24px;height:24px}'+
'.s7 .rzh{font:600 20px Fraunces,Georgia,serif;margin:24px 0 10px}'+
'.s7 .mch{display:flex;gap:14px;align-items:center;padding:14px 16px;border:1px solid var(--ln);border-radius:22px;background:linear-gradient(160deg,var(--pn),color-mix(in srgb,var(--ac) 6%,var(--pn)))}'+
'.s7 .mch img{flex:none;width:84px;height:auto}.s7 .mch small{display:block;font:700 10.5px Inter,system-ui,sans-serif;letter-spacing:.14em;color:var(--ac)}.s7 .mch b{display:block;font:600 19px/1.2 Fraunces,Georgia,serif;color:var(--tx);margin:4px 0 2px}.s7 .mch p{margin:0 0 10px;font-size:13px;color:var(--mu)}'+
'.s7 .mch .rzg{display:inline-flex;align-items:center;gap:8px}'+
'.s7 .ver{display:block;text-align:right;color:var(--ac);font:600 14.5px Inter;margin:12px 4px 0}'+
'.s7 .hsh2{display:flex;justify-content:space-between;align-items:baseline;margin:0 0 12px}'+
'.s7 .whole{padding:22px;margin-top:26px;display:block}.s7 .whole h2{font:600 22px/1.2 Fraunces,Georgia,serif;margin:8px 0 6px}.s7 .whole .btn{margin-top:16px;width:100%}'+
'.s7 .rzr.st{cursor:default}.s7 .rzr.st>i{display:none}.s7 .num{flex:none;width:34px;height:34px;border-radius:50%;border:1px solid var(--ln2);display:grid;place-items:center;font:600 15px Fraunces,Georgia,serif;color:var(--ac)}'+
'.s7 .ey{display:block;font:700 10.5px Inter,system-ui,sans-serif;letter-spacing:.14em;color:var(--ac);text-transform:uppercase;margin-top:10px}'+
'.s7 .nota{font-size:14px;color:var(--mu);line-height:1.55;margin:14px 2px 0}';
document.head.appendChild(css);
function ic(i){var s=document.querySelectorAll('.htr svg');return s[i]?s[i].outerHTML:''}
var FOTO={transp:'/media/i/b95b382e346d.jpg',hex:'/media/i/3c5853357cf4.jpg',arm:'/media/i/80f4857cb1cf.jpg',verde:'/media/i/2c4d351d1f1c.jpg',preto:'/media/i/b0ce33cc336d.jpg'};
function rosto(){return ['428f6af5a765','bcdc589a95be'].map(function(k){return '<span class="rzi" style="-webkit-mask-image:url(/media/i/'+k+'.png);mask-image:url(/media/i/'+k+'.png)"></span>'}).join('')}
/* os grupos do Guia (a ordem é a mesma em todo lugar) */
var GR=[
 ['Antes de comprar',[
   ['r','Qual armação combina com o seu rosto?','Os formatos que valorizam cada rosto'],
   ['f:transp','Leitura, armação ou solar?','Para que serve cada um'],
   ['f:hex','UV400 e polarizado','O que protege e o que tira o reflexo'],
   ['f:arm','Fazem lentes com receita?','Não: só óculos de leitura prontos']]],
 ['Comprar e receber',[
   ['n:1','Como fazer o pedido','Carrinho, conta e pedido em 3 passos'],
   ['i:1','Pagamento','PIX ou QR do banco, depois do pedido'],
   ['i:0','Entrega e retirada','Delivery no Paraguai ou na loja em CDE'],
   ['i:2','Reserva e troca','Reservado até a entrega; troca na retirada']]],
 ['Depois da compra',[
   ['f:verde','Como limpar sem riscar','Três passos e o que nunca usar']]]];
function lado(k){if(k==='r')return '<span class="rzp">'+rosto()+'</span>';var t=k.split(':');
  if(t[0]==='f')return '<span class="rzp f"><img src="'+FOTO[t[1]]+'" alt=""></span>';if(t[0]==='i')return '<span class="rzp ic">'+ic(+t[1])+'</span>';
  return '<span class="rzp ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5h2l2 10h11l2-7H7"/><circle cx="9" cy="19" r="1.3"/><circle cx="17" cy="19" r="1.3"/></svg></span>'}
function linhas(L){return '<div class="rzl">'+L.map(function(x){return '<button type="button" class="rzr" data-s7="'+x[1]+'">'+lado(x[0])+'<span class="rzn"><b>'+x[1]+'</b><small>'+x[2]+'</small></span><i aria-hidden="true">›</i></button>'}).join('')+'</div>'}
var MOCHI='<div class="mch"><img src="/media/mochi_esboco.png" alt=""><span><small>COM VOZ · 1 MIN</small><b>Descubra o seu grau</b><p>O Mochi faz o teste de leitura com você.</p><button type="button" class="rzg" data-gzopen><span>Começar</span></button></span></div>';
/* o MESMO bloco: no Início só o começo (Mochi + Antes de comprar) */
function bloco(inteiro){var h=MOCHI;GR.forEach(function(g,i){if(!inteiro&&i>0)return;h+='<h3 class="rzh">'+g[0]+'</h3>'+linhas(inteiro||i>0?g[1]:g[1].slice(0,3))});return h}
window.__s7inicio=function(){var h=document.getElementById('hguia');if(!h)return;var g=h.nextElementSibling;var w=document.createElement('div');w.className='s7';
  w.innerHTML='<div class="hsh2"><h2 class="h2" style="margin:0">Guia La Fouch</h2></div>'+bloco(false)+'<a class="ver">Ver o guia completo ›</a>';h.replaceWith(w);if(g&&g.classList.contains('hgu'))g.remove()};
window.__s7menu=function(){var a=document.querySelector('#drw a[href="#como"]');if(!a)return;a.firstChild.textContent='Guia La Fouch'};
window.__s7pagina=function(){var c=document.getElementById('como');
  c.innerHTML='<div class="rzm s7" style="padding:18px 20px 120px"><button type="button" class="navb vback rzb" data-vback>'+BK+'<span>Início</span></button><h2 class="rzt">Guia La Fouch</h2><p class="rzs">Tudo para escolher, comprar e cuidar do seu óculos.</p>'+bloco(true)+
  '<div class="whole"><span class="eyebrow">Fale com a gente</span><h2>Ainda com dúvida?</h2><p>A loja responde pelo WhatsApp, de segunda a sábado.</p><a class="btn w">'+WA+'<span>Falar no WhatsApp</span></a></div></div>';c.scrollTop=0};
window.__s7pagamento=function(){var c=document.getElementById('como');
  c.innerHTML='<div class="rzm s7" style="padding:18px 20px 120px"><button type="button" class="navb vback rzb">'+BK+'<span>Guia</span></button><span class="ey">Comprar e receber</span><h2 class="rzt" style="margin-top:6px">Pagamento</h2><p class="rzs">Você paga depois de fazer o pedido.</p>'+
  '<div class="rzl"><div class="rzr st"><span class="rzp ic">'+ic(1)+'</span><span class="rzn"><b>PIX</b><small>Brasil e Argentina</small></span></div><div class="rzr st"><span class="rzp ic">'+ic(1)+'</span><span class="rzn"><b>QR do banco</b><small>Paraguai</small></span></div></div>'+
  '<p class="nota">O pedido fica reservado até a entrega ou a retirada.</p>'+
  '<h3 class="rzh">Veja também</h3>'+linhas([GR[1][1][0],GR[1][1][3]])+'</div>';c.scrollTop=0};
})();
