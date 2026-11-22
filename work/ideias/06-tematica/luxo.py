"""IDEIAS 06c v3 · movimento de LUXO para as datas (dono 22/11 14:57): sem partículas (neve, pétalas, morcegos).
Padrão das marcas de luxo: o movimento mora na FOTO/FILME da campanha, lento e uma vez só; o texto se revela; um brilho.
Dois movimentos (v4: o brilho saiu — dono 15:02, clichê), iguais em TODA data (a data muda só a foto, a cor e o chapéu do Mochi):
 1. a foto 'respira': aproxima 4% em 8 s, devagar, uma vez;
 3. o texto sobe e aparece (título pequeno, título, preço, botão, seleção), 500 ms cada, 80 ms entre um e outro.
Uma curva só (.16,1,.3,1, a mesma das camadas). Nada com 'reduzir movimento'. Uso: python3 luxo.py → /tmp/a6fl (:8733)"""
import shutil
CSS = ("@keyframes lxzoom{from{transform:scale(1)}to{transform:scale(1.04)}}"
              "@keyframes lxsobe{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}"
       ".lfcamp .ft{position:relative;overflow:hidden;background:none!important}"
       ".lfcamp .ft .im{position:absolute;inset:0;background:#fff center/86% no-repeat url(/dados/f/SL2265_53797392.jpg);animation:lxzoom 8s cubic-bezier(.16,1,.3,1) both}"
       ".lfcamp .tx>*{animation:lxsobe .5s cubic-bezier(.16,1,.3,1) both}"
       ".lfcamp .tx>:nth-child(1){animation-delay:.25s}.lfcamp .tx>:nth-child(2){animation-delay:.33s}.lfcamp .tx>:nth-child(3){animation-delay:.41s}"
       ".lfcamp .tx>:nth-child(4){animation-delay:.49s}.lfcamp .tx>:nth-child(5){animation-delay:.57s}"
       "@media (prefers-reduced-motion:reduce){.lfcamp .ft .im,.lfcamp .tx>*{animation:none}}")
JS = ("\n/* PINTURA · IDEIAS 06c v3: movimento de luxo na campanha */\n(function(){var s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);"
      "setInterval(function(){var f=document.querySelector('.lfcamp .ft');if(f&&!f.querySelector('.im')){var i=document.createElement('div');i.className='im';f.appendChild(i)}},50)})();\n") % CSS
shutil.rmtree('/tmp/a6fl', ignore_errors=True); shutil.copytree('/tmp/a6m', '/tmp/a6fl')
open('/tmp/a6fl/js/lf-site.js', 'a').write(JS); print('ok')
