/* PINTURA (só no esboço) · IDEIAS 08k2 · Minha conta (e Entrar) abrem e fecham com a MESMA camada do carrinho e do menu.
   Causa: as camadas "no centro" (.scrim.pg.acc / .auth) não passavam pelo mesmo caminho de abrir — o site animava só o
   painel (CSS pgrise 0,28 s subindo 10 px, e a mcEntra subindo cada bloco); na saída já passavam pela camada (lado, 0,7 s).
   Jeito natural: TODA camada do #layer abre pelo mesmo caminho (camada()), e saem as animações de entrada próprias. */
(function(){
 var s=document.createElement('style');s.id='pinta13';
 s.textContent='html .scrim.pg>.modal.pgm,html .scrim.pg>.panel,html .scrim.pg.acc>.panel{animation:none!important}';
 (document.head||document.documentElement).appendChild(s);
 window.__lfTk2=1;  /* a mcEntra (blocos subindo um a um) sai: quem anima a entrada é a camada */
 var L=document.getElementById('layer');if(!L)return;
 new MutationObserver(function(m){m.forEach(function(r){[].forEach.call(r.addedNodes,function(el){
  if(!(el.matches&&el.matches('.scrim.pg')))return;
  requestAnimationFrame(function(){if(!el.isConnected||el.getAnimations().length)return;
   el.animate([{opacity:0},{opacity:1}],{duration:1})})})})}).observe(L,{childList:true});  /* entra na camada() */
})();
