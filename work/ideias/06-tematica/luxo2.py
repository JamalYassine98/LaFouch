"""IDEIAS 06d · movimento de luxo VISÍVEL no destaque da data (dono 22/11 15:06: 'não vi animação' + 'Ver presentes soa errado').
Estudo (REFERENCIAS.md, parte 2): no luxo o movimento é a campanha em CÂMERA LENTA — fotos que se dissolvem devagar
(dissolve longo, ~1,2 s, 'corte de cinema') com aproximação lenta em cada uma — e o texto entra coreografado.
Botão: verbo de experiência + o que se vai ver ('Descobrir a seleção'), e não 'Ver presentes'.
Aqui: 3 fotos reais de peças (SL2265, SL2300, SL2270) no lugar das fotos da campanha do Semp.
Cada foto fica 4,5 s, dissolve 1,4 s, e aproxima 6% enquanto está na tela. O texto entra 1 vez.
Nada se mexe com 'reduzir movimento' (fica a 1ª foto parada). Uso: python3 luxo2.py → /tmp/a6fs (:8734)"""
import shutil
FOTOS = [['/dados/f/SL2265_53797392.jpg', 'Óculos de sol gatinho · G$ 139.000'], ['/dados/f/SL2300_2388903172.jpg', 'Óculos de sol gatinho · G$ 143.000'], ['/dados/f/SL2270_2924924364.jpg', 'Óculos de sol hexagonal · G$ 149.000']]
CSS = ("@keyframes lxsobe{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}"
       ".lfcamp .ft{position:relative;overflow:hidden;background:#fff!important}"
       ".lfcamp .ft .sl{position:absolute;inset:0;background:#fff center/86% no-repeat;opacity:0;transition:opacity 1.4s cubic-bezier(.45,0,.25,1)}"
       ".lfcamp .ft .sl.on{opacity:1}"
       ".lfcamp .ft .sl.vai{transition:opacity 1.4s cubic-bezier(.45,0,.25,1),transform 6.5s linear;transform:scale(1.06)}"
       ".lfcamp .tx>*{animation:lxsobe .7s cubic-bezier(.16,1,.3,1) both}"
       ".lfcamp .tx>:nth-child(1){animation-delay:.3s}.lfcamp .tx>:nth-child(2){animation-delay:.42s}.lfcamp .tx>:nth-child(3){animation-delay:.54s}"
       ".lfcamp .tx>:nth-child(4){animation-delay:.66s}.lfcamp .tx>:nth-child(5){animation-delay:.78s}"
       "@media (prefers-reduced-motion:reduce){.lfcamp .tx>*{animation:none}.lfcamp .ft .sl{transition:none!important;transform:none!important}}")
JS = ("\n/* PINTURA · IDEIAS 06d: campanha em câmera lenta (dissolve + aproximação) */\n(function(){var F=%r;var s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);"
      "var red=matchMedia('(prefers-reduced-motion: reduce)').matches;"
      "function liga(f){if(f._ok)return;f._ok=1;var L=F.map(function(u){var d=document.createElement('div');d.className='sl';d.style.backgroundImage='url('+u[0]+')';f.appendChild(d);return d});var P=f.parentNode.querySelector('.p');"
      " var i=0;function mostra(){L.forEach(function(d,k){if(k!==i){d.classList.remove('on');setTimeout(function(){if(!d.classList.contains('on')){d.classList.remove('vai');d.style.transform=''}},1500)}});"
      "  var d=L[i];d.classList.add('on');if(P){if(P.textContent&&P.textContent!==F[i][1]){P.style.transition='opacity .7s';P.style.opacity=0;var t=F[i][1];setTimeout(function(){P.textContent=t;P.style.opacity=1},700)}else P.textContent=F[i][1]}if(!red)requestAnimationFrame(function(){d.classList.add('vai')})}"
      " mostra();if(!red)setInterval(function(){i=(i+1)%%L.length;mostra()},4500)}"
      "setInterval(function(){var f=document.querySelector('.lfcamp .ft');if(f)liga(f);var b=document.querySelector('.lfcamp .bt');if(b&&b.textContent!=='Descobrir a seleção')b.textContent='Descobrir a seleção'},50)})();\n") % (FOTOS, CSS)
shutil.rmtree('/tmp/a6fs', ignore_errors=True); shutil.copytree('/tmp/a6m', '/tmp/a6fs')
open('/tmp/a6fs/js/lf-site.js', 'a').write(JS); print('ok')
