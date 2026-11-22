"""IDEIAS 06c v2 · flocos com SENSAÇÃO DE NEVE (dono 22/11 14:42), mesmo com só 8 flocos.
O que faz parecer neve: (1) PROFUNDIDADE — 3 flocos perto (grandes, desfocados, um pouco mais rápidos) e 5 longe
(pequenos, nítidos, lentos); (2) BALANÇO — cada floco oscila de um lado para o outro enquanto cai (neve não cai reta);
(3) QUEDA LENTA — 45 a 75 px por segundo; (4) floco macio (miolo branco que se desfaz na borda) com um halo leve para
aparecer em foto clara; (5) a tela já começa com neve no ar (sem 'chuva' começando do topo) e tudo entra e sai suave.
Continua: só na foto da campanha, 4 s ao chegar, some em 1,2 s, nada com 'reduzir movimento'.
Uso: python3 neve.py → /tmp/a6fn (:8731)"""
import shutil
CSS = ("@keyframes snc{from{transform:translate3d(0,-14px,0)}to{transform:translate3d(0,var(--h),0)}}"
       "@keyframes sns{from{transform:translateX(calc(var(--sw)*-1))}to{transform:translateX(var(--sw))}}"
       "@keyframes snin{from{opacity:0}to{opacity:1}}"
       ".lfcamp .ft{position:relative;overflow:hidden;--nv1:#dfe5ec;--nv2:#c6cfda}"
       ".lfcamp .ft[data-escura]{--nv1:#fff;--nv2:#ffffffb3}"
       ".lfcamp .evfx{animation:snin .8s ease-out backwards}"
       ".lfcamp .sn{position:absolute;top:0;animation:snc var(--d) linear var(--a) infinite;will-change:transform}"
       ".lfcamp .sn b{display:block;width:var(--t);height:var(--t);border-radius:50%;opacity:var(--o);"
       "background:radial-gradient(circle,var(--nv1) 0 35%,var(--nv2) 65%,transparent 100%);filter:blur(var(--bl));"
       "animation:sns var(--sd) ease-in-out var(--a) infinite alternate}"
       "@media (prefers-reduced-motion:reduce){.lfcamp .evfx{display:none}}")
JS = r"""
/* PINTURA · IDEIAS 06c v2: neve com profundidade e balanço */
(function(){var s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);
 function r(a,b){return a+Math.random()*(b-a)}
 var FLOCOS=[[1,3],[0,5]];/* [perto?, quantos] */
 function fx(){var f=document.querySelector('.lfcamp .ft');if(!f||f.querySelector('.evfx'))return;var H=f.offsetHeight,h='';
  FLOCOS.forEach(function(g){for(var i=0;i<g[1];i++){var perto=g[0],d=perto?r(4.6,5.4):r(6.5,7.5);
   h+='<i class="sn" style="left:'+r(4,94)+'%%;--h:'+(H+28)+'px;--d:'+d+'s;--a:-'+r(0,d)+'s;--t:'+(perto?r(11,14):r(4,6))+'px;--bl:'+(perto?1:0)+'px;--sh:'+(perto?3:1.5)+'px;--o:'+(perto?.95:.8)+';--sw:'+(perto?r(10,16):r(5,9))+'px;--sd:'+r(1.6,2.6)+'s"><b></b></i>'}});
  var c=document.createElement('div');c.className='evfx';c.innerHTML=h;f.appendChild(c);setTimeout(function(){c.classList.add('fim')},4000)}
 setInterval(fx,300)})();
""" % CSS
shutil.rmtree('/tmp/a6fn', ignore_errors=True); shutil.copytree('/tmp/a6m', '/tmp/a6fn')
open('/tmp/a6fn/js/lf-site.js', 'a').write(JS); print('ok')
