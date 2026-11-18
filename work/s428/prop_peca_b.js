/* S428 esboço PEÇA opção B (dono 18/11 16:01, jeito Apple): no topo fica só o botão "‹ Armações" (sempre inteiro);
   o caminho completo "Catálogo › Armações › GR3340" vai pequeno para o FIM da página da peça, e quebra de linha em vez de cortar. */
(function(){
  var s=document.createElement('style');s.textContent='.pgbar .pgcr{display:none!important}.pgbar .pgback{max-width:100%!important}'+
    '.lfcam{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin:32px 0 24px;color:var(--mu);font:500 13px/1.5 Inter,system-ui,sans-serif}'+
    '.lfcam button{border:0;background:none;padding:12px 0;margin:-12px 0;font:inherit;color:inherit;cursor:pointer}.lfcam i{font-style:normal;opacity:.7}.lfcam span{color:var(--tx)}';
  document.head.appendChild(s);
  function poe(){document.querySelectorAll('#layer .scrim.pg').forEach(function(sc){var bar=sc.querySelector('.pgbar .pgcr'),m=sc.querySelector('.modal.pgm');if(!bar||!m)return;
    var c=m.querySelector(':scope>.lfcam');if(c&&c.__src===bar.innerHTML)return;if(!c){c=document.createElement('nav');c.className='lfcam';c.setAttribute('aria-label','Você está em');var ft=m.querySelector(':scope>.lfft');ft?m.insertBefore(c,ft):m.appendChild(c)}
    c.innerHTML=bar.innerHTML;c.__src=bar.innerHTML;
    c.querySelectorAll('button').forEach(function(b,i){b.addEventListener('click',function(e){e.preventDefault();var o=bar.querySelectorAll('button')[i];o&&o.click()})})})}
  var t=0;new MutationObserver(function(){cancelAnimationFrame(t);t=requestAnimationFrame(poe)}).observe(document.body,{childList:true,subtree:true});poe();
})();
