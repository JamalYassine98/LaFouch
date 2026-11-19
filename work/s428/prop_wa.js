/* S428 esboço WHATSAPP AO ROLAR (dono 19/11): o botão flutuante continua; enquanto a pessoa rola a página ele sai pela borda
   (esmaece e desliza para fora, 0,2 s) e volta 0,6 s depois que ela para (0,28 s, a mesma curva do site). Assim não fica por cima
   do que está passando. Respeita "reduzir movimento" (só some e volta, sem deslizar). */
(function(){
  var s=document.createElement('style');s.textContent='html body a.wa{transition:opacity .2s cubic-bezier(.4,0,.6,1),translate .2s cubic-bezier(.4,0,.6,1)!important}html.lfwah.lfwah.lfwah.lfwah.lfwah.lfwah body a.wa.wa.wa{opacity:0!important;translate:calc(100% + 8px) 0!important;pointer-events:none!important}html:not(.lfwah) body a.wa{transition-duration:.28s!important;transition-timing-function:cubic-bezier(.2,.8,.2,1)!important}@media (prefers-reduced-motion:reduce){html body a.wa{translate:none!important}}';
  document.head.appendChild(s);var t=0,h=document.documentElement;
  addEventListener('scroll',function(){h.classList.add('lfwah');clearTimeout(t);t=setTimeout(function(){h.classList.remove('lfwah')},600)},{passive:true,capture:true});
})();
