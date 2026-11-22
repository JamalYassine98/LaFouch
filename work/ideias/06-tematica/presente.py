"""IDEIAS 06g · opção 'Para presente' no carrinho (dono 22/11 15:38). Base = /tmp/a6fg (todos os aprovados + 06).
No carrinho, logo abaixo das peças, um cartão no mesmo desenho do cartão da peça:
  'Para presente' + 'Embalagem La Fouch e um cartão com a sua mensagem' + escolha de dois lados (Não | Sim).
  Sim → abre ali mesmo (⌄, regra 16 'ler/abrir no lugar'): campo em linha fina 'Mensagem do cartão (opcional)',
  contador 0/200, e a frase 'O pacote vai sem o preço.' O Resumo ganha a linha 'Embalagem de presente · grátis'.
Uso: python3 presente.py → /tmp/a6fp2 (:8737)"""
import shutil
GIFT = ('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12h18M12 8v13M12 8c-2-4-6-4-6-1s6 1 6 1zm0 0c2-4 6-4 6-1s-6 1-6 1z"/></svg>')
CSS = (".lfgift{margin:16px 0 0;padding:16px;border-radius:22px;background:var(--pn);border:1px solid var(--ln)}"
       ".lfgift .hd{display:flex;align-items:center;gap:8px;font:600 17px Inter,sans-serif;color:var(--tx)}"
       ".lfgift .ds{font:400 14px/1.4 Inter,sans-serif;color:var(--mu);margin:4px 0 16px}"
       ".lfgift .dl{display:flex;border:1px solid var(--ln2);border-radius:999px;padding:4px;gap:4px}"
       ".lfgift .dl button{all:unset;flex:1;text-align:center;height:40px;line-height:40px;border-radius:999px;font:500 15px Inter,sans-serif;color:var(--mu);cursor:pointer;text-transform:none!important;letter-spacing:0!important}"
       ".lfgift .dl button.on{background:var(--tx);color:var(--bg)}"
       ".lfgift .ab{display:grid;grid-template-rows:0fr;transition:grid-template-rows .42s cubic-bezier(.16,1,.3,1)}.lfgift.sim .ab{grid-template-rows:1fr}"
       ".lfgift .ab>div{overflow:hidden}.lfgift .cp{margin-top:16px;border-bottom:1px solid var(--ln2);padding:8px 0}"
       ".lfgift .cp small{display:block;font:500 12px Inter,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--mu)}"
       ".lfgift textarea{all:unset;display:block;width:100%;min-height:48px;font:400 16px/1.4 Inter,sans-serif;color:var(--tx);margin-top:4px}"
       ".lfgift .ct{font:400 12px Inter,sans-serif;color:var(--mu);text-align:right;margin-top:4px;font-variant-numeric:tabular-nums}"
       ".lfgift .nt{font:400 14px/1.4 Inter,sans-serif;color:var(--mu);margin-top:8px}")
JS = ("\n/* PINTURA · IDEIAS 06g: Para presente no carrinho */\n(function(){var s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);"
      "setInterval(function(){var p=document.querySelector('#layer .cartp');if(!p||p.querySelector('.lfgift'))return;"
      " var it=[].filter.call(p.querySelectorAll('*'),function(e){return e.querySelector&&e.querySelector('.crl')&&getComputedStyle(e).borderTopLeftRadius!=='0px'&&e.getBoundingClientRect().width>300}).pop();if(!it)return;"
      " var g=document.createElement('div');g.className='lfgift';g.innerHTML='<div class=\"hd\">'+%r+'Para presente</div><p class=\"ds\">Embalagem La Fouch e um cartão com a sua mensagem. Grátis no Natal.</p>"
      "<div class=\"dl\" role=\"radiogroup\"><button class=\"on\" data-g=\"0\">Não</button><button data-g=\"1\">Sim</button></div>"
      "<div class=\"ab\"><div><label class=\"cp\"><small>Mensagem do cartão (opcional)</small><textarea maxlength=\"200\" rows=\"2\"></textarea></label><div class=\"ct\">0/200</div><p class=\"nt\">O pacote vai sem o preço.</p></div></div>';"
      " it.parentNode.insertBefore(g,it.nextSibling);g.querySelectorAll('.dl button').forEach(function(b){b.onclick=function(){g.querySelectorAll('.dl button').forEach(function(x){x.classList.toggle('on',x===b)});g.classList.toggle('sim',b.dataset.g==='1')}});"
      " var ta=g.querySelector('textarea');ta.oninput=function(){g.querySelector('.ct').textContent=ta.value.length+'/200'}},200)})();\n") % (CSS, GIFT)
shutil.rmtree('/tmp/a6fp2', ignore_errors=True); shutil.copytree('/tmp/a6fg', '/tmp/a6fp2')
open('/tmp/a6fp2/js/lf-site.js', 'a').write(JS); print('ok')
