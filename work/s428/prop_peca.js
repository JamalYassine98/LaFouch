/* S428 esboço PEÇA (regra do dono 18/11: a letra cresce até onde cabe sem quebrar o design).
   A linha "‹ Armações   Catálogo › Armações › GR3340" nunca corta: se não cabe inteira, some primeiro "Catálogo ›",
   depois a categoria repetida (o botão ‹ já diz qual é), e por último a trilha toda — o botão de voltar e a referência ficam inteiros. */
(function(){
  function cabe(bar){var bk=bar.querySelector('.pgback span'),cr=bar.querySelector('.pgcr');
    if(bk&&bk.scrollWidth>bk.clientWidth+1)return false;if(cr&&cr.offsetWidth&&cr.scrollWidth>cr.clientWidth+1)return false;return bar.scrollWidth<=bar.clientWidth+1}
  function ajusta(bar){var cr=bar.querySelector('.pgcr'),bk=bar.querySelector('.pgback');if(!cr||!bk)return;
    var k=[].slice.call(cr.children);k.forEach(function(e){e.style.display=''});cr.style.display='';bk.style.maxWidth='';
    if(cabe(bar))return;
    var passos=[[k[0],k[1]],[k[2],k[3]]];
    for(var i=0;i<passos.length;i++){passos[i].forEach(function(e){if(e)e.style.display='none'});bk.style.maxWidth='62%';if(cabe(bar))return}
    cr.style.display='none';bk.style.maxWidth='100%'}
  function todas(){document.querySelectorAll('.pgbar').forEach(ajusta)}
  var t=0;function logo(){if(t)return;t=requestAnimationFrame(function(){t=0;(todas)()})}
  new MutationObserver(logo).observe(document.body,{childList:true,subtree:true});
  addEventListener('resize',logo);logo();
})();
