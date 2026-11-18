/* S428 esboço MENU v3 (dono 18/11 18:18): o cartão da conta mostra "Minha conta · Meus pedidos ›" quando cabe numa linha;
   quando NÃO cabe (letra maior), fica só "Meus pedidos ›" embaixo de "Olá, Maria" — tocar no nome/foto leva à Minha conta,
   "Meus pedidos ›" abre direto a aba Pedidos. Nunca parte palavra em duas linhas. */
(function(){
  var s=document.createElement('style');s.textContent='#dacs{display:block;white-space:nowrap;overflow:hidden}';document.head.appendChild(s);
  var CURTO='Meus pedidos ›';
  function aj(){var e=document.getElementById('dacs');if(!e)return;var o=e.getAttribute('data-lfo');
    if(!o||(e.textContent!==o&&e.textContent!==CURTO)){o=e.textContent;e.setAttribute('data-lfo',o)}
    if(e.textContent!==o)e.textContent=o;e.removeAttribute('data-lfc');if(e.scrollWidth<=e.clientWidth+1)return;
    e.textContent=CURTO;e.setAttribute('data-lfc','1')}
  document.addEventListener('click',function(ev){var e=ev.target.closest&&ev.target.closest('#dacs');if(!e||!e.getAttribute('data-lfc'))return;
    setTimeout(function(){var b=document.querySelectorAll('#layer .mct>button');if(b[2])b[2].click()},700)},true);
  var t=0;new MutationObserver(function(){if(t)return;t=requestAnimationFrame(function(){t=0;(aj)()})}).observe(document.body,{childList:true,subtree:true,characterData:true});
  addEventListener('resize',function(){requestAnimationFrame(aj)});aj();
})();
