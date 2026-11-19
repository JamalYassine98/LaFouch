/* S428 esboço MENU (regra do dono 18/11: a letra cresce até onde cabe sem quebrar o design).
   O cartão da conta no menu diz "Minha conta · Meus pedidos ›" numa linha só; se não couber, fica "Minha conta ›"
   (os pedidos estão dentro da conta) — nunca parte "Meus / pedidos" em duas linhas. */
(function(){
  var s=document.createElement('style');s.textContent='#dacs{display:block;white-space:nowrap;overflow:hidden}';document.head.appendChild(s);
  function aj(){var e=document.getElementById('dacs');if(!e)return;var o=e.getAttribute('data-lfo');
    if(!o||(e.textContent!==o&&e.textContent!==e.getAttribute('data-lfc'))){o=e.textContent;e.setAttribute('data-lfo',o)}
    if(e.textContent!==o)e.textContent=o;if(e.scrollWidth<=e.clientWidth+1)return;
    var c=o.split('·')[0].trim().replace(/\s*›$/,'')+' ›';e.setAttribute('data-lfc',c);e.textContent=c}
  var t=0;new MutationObserver(function(){if(t)return;t=requestAnimationFrame(function(){t=0;(aj)()})}).observe(document.body,{childList:true,subtree:true,characterData:true});
  addEventListener('resize',function(){requestAnimationFrame(aj)});aj();
})();
