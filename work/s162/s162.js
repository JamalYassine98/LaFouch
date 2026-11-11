/* S162 esboço: transição suave entre Carrinho → Entrega → Pagamento */
(function(){
var css=document.createElement('style');css.textContent='.cartp .stp span b{transition:background .3s,color .3s,border-color .3s}';document.head.appendChild(css);
var ult=null;
function passo(){var sp=document.querySelectorAll('.cartp .stp span');for(var i=sp.length-1;i>=0;i--){if(sp[i].classList.contains('on'))return i}var t=(document.querySelector('.cartp .cl')||{}).textContent||'';return /Forma de pagamento/.test(t)?2:/Como você recebe/.test(t)?1:0}
function anima(){var cl=document.querySelector('.cartp .cl');if(!cl||cl.__s62)return;cl.__s62=1;var p=passo();var dir=ult===null?0:(p>ult?1:p<ult?-1:0);
 if(dir&&!matchMedia('(prefers-reduced-motion: reduce)').matches){cl.animate([{transform:'translateX('+(dir*28)+'px)',opacity:0},{transform:'none',opacity:1}],{duration:300,easing:'cubic-bezier(.2,.8,.2,1)'});
  var b=document.querySelectorAll('.cartp .stp span b')[p];if(b)b.animate([{transform:'scale(.7)'},{transform:'scale(1.15)'},{transform:'none'}],{duration:380,easing:'ease-out'})}
 ult=p;
 document.querySelectorAll('.cartp [data-v="pix"] small').forEach(function(s){s.textContent=s.textContent.replace(/\s*Confirmação automática\.?/,'')})}
var mo=new MutationObserver(function(){mo.disconnect();try{anima();var falta=document.querySelector('.cartp .cfo>span:not(.s60i)')||(document.querySelector('.cartp [data-v="pix"]')&&!document.querySelector('.s59'));if(falta&&window.__s60)window.__s60();document.querySelectorAll('.cartp [data-v="pix"] small').forEach(function(s){s.textContent=s.textContent.replace(/\s*Confirmação automática\.?/,'')})}catch(_){}mo.observe(document.body,{childList:true,subtree:true})});mo.observe(document.body,{childList:true,subtree:true});
})();
