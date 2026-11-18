/* S428 esboço TOPO (regra do dono 18/11: a letra cresce até onde cabe sem quebrar o design).
   O topo (menu, conta, logo, busca, carrinho) cresce junto com a letra só até caber: quando o carrinho ia passar da borda,
   o topo para de crescer (encolhe só ele, o resto da página continua com a letra maior). Margens e alinhamento iguais aos de hoje. */
(function(){
  function aj(){var t=document.querySelector('.top');if(!t)return;t.style.zoom='';
    var W=document.documentElement.clientWidth,b=document.getElementById('bagbtn'),m=document.getElementById('mnb');if(!b||!m)return;
    var mg=Math.max(0,m.getBoundingClientRect().left);/* a mesma margem da esquerda vale para a direita */
    for(var k=0;k<4;k++){var r=b.getBoundingClientRect().right,lim=W-mg;if(r<=lim+1)break;var z=(parseFloat(t.style.zoom)||1)*(lim/r);t.style.zoom=Math.floor(z*1000)/1000}
    try{window.dispatchEvent(new Event('lf:topo'))}catch(_){}}
  var t0=0;function logo(){if(t0)return;t0=requestAnimationFrame(function(){t0=0;(aj)()})}
  addEventListener('resize',logo);new MutationObserver(logo).observe(document.body,{attributes:true,attributeFilter:['style']});logo();setTimeout(logo,900);setTimeout(logo,2600);
})();
