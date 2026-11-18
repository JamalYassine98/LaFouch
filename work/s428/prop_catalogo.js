/* S428 esboço CATÁLOGO (regra do dono 18/11: a letra cresce até onde cabe sem quebrar o design).
   (1) "Filtros ›" sai da fileira Todos/Feminino/Masculino/Unissex e vai para a linha do título, na margem da direita,
       na mesma linha de base do título (regras 1 e 7) — nunca fica pela metade.
   (2) A fileira de gênero fica inteira na moldura: se não couber, a letra dela fica do maior tamanho que cabe (mesma regra das abas da conta).
   (3) A etiqueta "Última unidade" / "Últimas N unidades" nos cartões nunca corta: se não couber, a letra dela fica do maior tamanho que cabe. */
(function(){
  var s=document.createElement('style');s.textContent='.mobsearch.lfft{position:relative}.mobsearch.lfft>.lfgf{position:absolute;right:0;white-space:nowrap;color:var(--ac);font:500 14px var(--body),Inter,system-ui,sans-serif;text-decoration:none;line-height:1}.mobsearch.lfft>.lfgf:after{content:"";position:absolute;inset:-14px -8px}.mobsearch.lfft>.lfgf i{font-style:normal}#lfgen.lfsf{overflow:visible}#lfgen.lfsf>button{white-space:nowrap}';
  document.head.appendChild(s);
  function base(e){var p=document.createElement('span');p.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline';e.appendChild(p);var y=p.getBoundingClientRect().top;p.remove();return y}
  function aj(){var g=document.getElementById('lfgen'),v=document.getElementById('vtitT'),m=v&&v.closest('.mobsearch');if(!g||!v||!m)return;
    var f=g.querySelector('.lfgf');if(f){m.appendChild(f);m.classList.add('lfft')}f=m.querySelector(':scope>.lfgf');
    if(f){var z=parseFloat(getComputedStyle(document.body).zoom)||1,mr=m.getBoundingClientRect();f.style.top='0px';var d=base(v)-base(f);var nt=Math.round(d/z*10)/10+'px';if(f.style.top!==nt)f.style.top=nt}
    g.classList.add('lfsf');var bs=[].slice.call(g.querySelectorAll('button'));if(!bs.length)return;var W=g.clientWidth;
    if(g.getAttribute('data-lfw')===String(W)&&g.scrollWidth<=W+.5)return;bs.forEach(function(b){b.style.fontSize=''});
    if(g.scrollWidth>W+.5){var f0=parseFloat(getComputedStyle(bs[0]).fontSize)||14,lo=9,hi=f0;
      for(var k=0;k<8;k++){var md=(lo+hi)/2;bs.forEach(function(b){b.style.fontSize=md+'px'});if(g.scrollWidth<=W+.5)lo=md;else hi=md}
      bs.forEach(function(b){b.style.fontSize=Math.floor(lo*4)/4+'px'})}
    g.setAttribute('data-lfw',String(W))}
  function etiq(){document.querySelectorAll('.ulin').forEach(function(e){if(e.getAttribute('data-lfw')===String(e.clientWidth)&&e.scrollWidth<=e.clientWidth)return;e.style.fontSize='';
    if(e.scrollWidth>e.clientWidth){var f0=parseFloat(getComputedStyle(e).fontSize)||12,lo=8,hi=f0;for(var k=0;k<7;k++){var md=(lo+hi)/2;e.style.fontSize=md+'px';if(e.scrollWidth<=e.clientWidth-1)lo=md;else hi=md}e.style.fontSize=Math.floor(lo*4)/4+'px'}
    e.setAttribute('data-lfw',String(e.clientWidth))})}
  var t0=0;function logo(){if(t0)return;t0=requestAnimationFrame(function(){t0=0;(function(){try{aj()}catch(_){}try{etiq()}catch(_){}})()})}
  new MutationObserver(function(ms){if(ms.every(function(x){return x.type==='attributes'&&x.target.classList&&(x.target.classList.contains('lfgf')||x.target.classList.contains('ulin'))}))return;logo()}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});addEventListener('resize',logo);logo();
})();
