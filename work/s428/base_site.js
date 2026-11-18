/* BASE APROVADA do site (S428, aprovado 18/11 14:59, ainda não implementado): Minha conta/peça coladas no topo com a letra maior
   (--hth no tamanho da página). A pílula sem emenda não aparece na peça. Injetado só na cópia "prop" para os esboços ficarem sobre a base. */
(function(){
  function hth(){var t=document.querySelector('.top');if(!t)return;var z=parseFloat(getComputedStyle(document.body).zoom)||1;document.documentElement.style.setProperty('--hth',Math.round(t.getBoundingClientRect().bottom/z*100)/100+'px')}
  addEventListener('resize',function(){setTimeout(hth,0)});hth();setTimeout(hth,900);setTimeout(hth,2600);
  new MutationObserver(function(){requestAnimationFrame(hth)}).observe(document.body,{attributes:true,attributeFilter:['style']});
})();
