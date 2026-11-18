/* BASE APROVADA do site (S428, aprovado 18/11 14:59, ainda não implementado): Minha conta/peça coladas no topo com a letra maior
   (--hth no tamanho da página). + pílula das abas sem emenda + abas da Minha conta com a letra do maior tamanho que cabe na moldura (regra do dono 14:45/14:52). Injetado só na cópia "prop" para os esboços ficarem sobre a base. */
(function(){
  function hth(){var t=document.querySelector('.top');if(!t)return;var z=parseFloat(getComputedStyle(document.body).zoom)||1;document.documentElement.style.setProperty('--hth',Math.round(t.getBoundingClientRect().bottom/z*100)/100+'px')}
  addEventListener('resize',function(){setTimeout(hth,0)});hth();setTimeout(hth,900);setTimeout(hth,2600);
  new MutationObserver(function(){requestAnimationFrame(hth)}).observe(document.body,{attributes:true,attributeFilter:['style']});
})();

(function(){
  var st=document.createElement('style');st.textContent='.lfTk>.lfP>b.m{width:64px!important}';document.head.appendChild(st);
  /* pílula sem emenda: o meio tem 64 px de base (sem borrão na borda) e entra 1 px em cada ponta */
  function meio(m){var t=m.style.transform;if(!t||m.__lfT===t)return;var r=/translate\(([-\d.e]+)px, ?([-\d.e]+)px\) scaleX\(([-\d.e]+)\)/.exec(t);if(!r)return;var k=+r[3];var n='translate('+(+r[1]-.5)+'px, '+r[2]+'px) scaleX('+((k+1)/64)+')';m.__lfT=n;m.style.transform=n}
  new MutationObserver(function(ms){ms.forEach(function(x){if(x.target.matches&&x.target.matches('.lfP>b.m'))meio(x.target)})}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['style']});
  document.querySelectorAll('.lfP>b.m').forEach(meio);
  function cabe(el){var bs=[].slice.call(el.querySelectorAll('button')),ori=[].filter.call(el.children,function(b){return b.tagName==='BUTTON'});
    var f=el.getAttribute('data-lff'),W=el.clientWidth;if(f&&el.getAttribute('data-lfw')===String(W)&&el.scrollWidth<=W+.5)return;
    bs.forEach(function(b){b.style.fontSize=''});var mudou=!!f;el.removeAttribute('data-lff');
    if(el.scrollWidth>W+.5){var f0=parseFloat(getComputedStyle(ori[0]).fontSize)||14,lo=9,hi=f0;
      for(var k=0;k<8;k++){var md=(lo+hi)/2;ori.forEach(function(b){b.style.fontSize=md+'px'});if(el.scrollWidth<=W+.5)lo=md;else hi=md}
      var fz=Math.floor(lo*4)/4+'px';bs.forEach(function(b){b.style.fontSize=fz});el.setAttribute('data-lff',fz);mudou=true}
    el.setAttribute('data-lfw',String(W));
    if(mudou){el.style.paddingRight='4.01px';requestAnimationFrame(function(){el.style.paddingRight=''})}}
  function todas(){document.querySelectorAll('#layer .mct').forEach(cabe)}
  var t=0;function logo(){cancelAnimationFrame(t);t=requestAnimationFrame(todas)}
  new MutationObserver(logo).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});addEventListener('resize',logo);
})();
