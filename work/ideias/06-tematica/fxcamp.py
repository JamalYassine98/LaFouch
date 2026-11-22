"""IDEIAS 06c · animação do evento dentro do Destaque Campanha (Natal).
Duas cópias do molde (/tmp/a6m): HOJE-REGRA = o efeito de hoje (14 flocos, 10 s) posto na foto da campanha;
PROPOSTA = 8 flocos finos, só 4 s ao chegar, e some (1,2 s). Flocos com uma sombra leve, para aparecer em foto clara.
Uso: python3 fxcamp.py → /tmp/a6fh (:8729) e /tmp/a6fp (:8730)"""
import shutil
JS = r"""
/* PINTURA · IDEIAS 06c: efeito do evento na foto da campanha */
(function(){var N=%d,DUR=%d;var s=document.createElement('style');s.textContent='.lfcamp .ft{position:relative;overflow:hidden}.lfcamp .evfx .fl{box-shadow:0 0 0 1px #0000001f,0 1px 3px #00000033}';document.head.appendChild(s);
 function r(a,b){return a+Math.random()*(b-a)}
 function fx(){var f=document.querySelector('.lfcamp .ft');if(!f||f.querySelector('.evfx'))return;var H=f.offsetHeight,h='';
  for(var i=0;i<N;i++)h+='<i class="fl" style="left:'+r(0,98)+'%%;--t:'+r(3,6)+'px;--d:'+r(%s)+'s;--a:-'+r(0,%s)+'s;--dx:'+r(-30,30)+'px;--h:'+(H+40)+'px;--r:'+r(-180,180)+'deg"></i>';
  var c=document.createElement('div');c.className='evfx';c.innerHTML=h;f.appendChild(c);setTimeout(function(){c.classList.add('fim')},DUR)}
 setInterval(fx,300)})();
"""
for dst, n, dur, d, a in (('/tmp/a6fh', 14, 10000, '7,12', '10'), ('/tmp/a6fp', 8, 4000, '3.2,4.4', '1.2')):
    shutil.rmtree(dst, ignore_errors=True); shutil.copytree('/tmp/a6m', dst)
    open(dst + '/js/lf-site.js', 'a').write(JS % (n, dur, d.replace(',', ','), a))
print('ok')
