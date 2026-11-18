/* S428 esboço CATÁLOGO (regra do dono 18/11: a letra cresce até onde cabe sem quebrar o design).
   (1) "Filtros ›" sai da fileira Todos/Feminino/Masculino/Unissex e vai para a linha do título, na margem da direita,
       na mesma linha de base do título (regras 1 e 7) — nunca fica pela metade.
   (2) A fileira de gênero fica inteira na moldura: se não couber, a letra dela fica do maior tamanho que cabe (mesma regra das abas da conta).
   (3) A etiqueta "Última unidade" / "Últimas N unidades" nos cartões nunca corta: se não couber, a letra dela fica do maior tamanho que cabe. */
(function(){
  var s=document.createElement('style');s.textContent='#vscr.lf8ti{position:relative}#vscr.lf8ti>.lfgf{position:absolute;white-space:nowrap;color:var(--ac);font:500 14px var(--body),Inter,system-ui,sans-serif;text-decoration:none;line-height:1;z-index:2}#vscr.lf8ti>.lfgf:after{content:"";position:absolute;inset:-14px -8px}#vscr.lf8ti>.lfgf i{font-style:normal}#lfgen.lfsf{overflow:visible}#lfgen.lfsf>button{white-space:nowrap}';
  document.head.appendChild(s);
  function base(e){var p=document.createElement('span');p.style.cssText='display:inline-block;width:0;height:0;vertical-align:baseline';e.appendChild(p);var y=p.getBoundingClientRect().top;p.remove();return y}
  function aj(){var g=document.getElementById('lfgen'),v=document.getElementById('vtitT'),sec=document.getElementById('vscr');if(!g||!v||!sec)return;
    var novo=g.querySelector('.lfgf');if(novo){[].slice.call(sec.querySelectorAll(':scope>.lfgf')).forEach(function(x){x.remove()});sec.appendChild(novo);sec.classList.add('lf8ti')}
    var f=sec.querySelector(':scope>.lfgf');if(f){var z=parseFloat(getComputedStyle(document.body).zoom)||1,sr=sec.getBoundingClientRect(),gr=g.getBoundingClientRect();
      var nr=Math.round((sr.right-gr.right)/z*10)/10+'px';if(f.style.right!==nr)f.style.right=nr;if(!f.style.top)f.style.top='0px';
      var d=(base(v)-base(f))/z;if(Math.abs(d)>.2){var nt=Math.round((parseFloat(f.style.top)+d)*10)/10+'px';f.style.top=nt}}
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
  new MutationObserver(function(ms){if(ms.every(function(x){return x.type==='attributes'&&x.target.classList&&(x.target.classList.contains('lfgf')||x.target.classList.contains('ulin')||x.target.id==='vscr')}))return;logo()}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});addEventListener('resize',logo);logo();
})();
