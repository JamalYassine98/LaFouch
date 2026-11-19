/* S428 esboço MENU v2 (ideia do dono 18/11 18:14): o cartão da conta fica "M  Olá, Maria" (tocar leva à Minha conta; sem › próprio, porque não
   alinharia com os › dos itens — regra 1) e embaixo só "Meus pedidos ›", que abre direto a aba Pedidos. Sai o texto "Minha conta". */
(function(){
  var s=document.createElement('style');s.textContent='#dacs{white-space:nowrap}';
  document.head.appendChild(s);
  function aj(){var e=document.getElementById('dacs');if(e&&e.textContent!=='Meus pedidos ›')e.textContent='Meus pedidos ›'}
  document.addEventListener('click',function(ev){var e=ev.target.closest&&ev.target.closest('#dacs');if(!e)return;
    setTimeout(function(){var b=document.querySelectorAll('#layer .mct>button');if(b[2])b[2].click()},700)},true);
  var t=0;new MutationObserver(function(){if(t)return;t=requestAnimationFrame(function(){t=0;(aj)()})}).observe(document.body,{childList:true,subtree:true,characterData:true});aj();
})();
