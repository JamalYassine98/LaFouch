"""IDEIAS 06b · MOLDE único de data, mostrado no Natal (dono 22/11 12:44).
Base = /tmp/a6p (identidade fixa da IDEIAS 06 + aprovados). Acrescenta o DESTAQUE CAMPANHA no topo do Início:
foto grande, título serifado, um botão, preço discreto e a SELEÇÃO DA DATA (Para ela · Para ele · Para todos).
A foto aqui é a foto real da peça SL2265 (o lugar da foto editorial da data, que vem do post da semana do Semp).
Uso: python3 copia.py && python3 molde.py → /tmp/a6m"""
import shutil
SRC, DST = '/tmp/a6p', '/tmp/a6m'
CSS = (".lfcamp{margin:16px 16px 8px;border-radius:22px;overflow:hidden;background:var(--pn);border:1px solid var(--ln)}"
       ".lfcamp .ft{aspect-ratio:4/3.4;background:#fff center/86% no-repeat url(/dados/f/SL2265_53797392.jpg)}"
       ".lfcamp .tx{padding:24px 24px 24px}"
       ".lfcamp .k{font:700 12px/1 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--act,var(--ac))}"
       ".lfcamp h2{font:600 30px/1.12 Fraunces,serif;margin:8px 0 8px;color:var(--tx)}"
       ".lfcamp .p{font:400 15px/1.4 Inter,sans-serif;color:var(--mu);margin:0 0 16px;font-variant-numeric:tabular-nums}"
       ".lfcamp .bt{display:flex;align-items:center;justify-content:center;height:48px;border-radius:999px;background:var(--act,var(--ac));color:#fff;font:600 16px Inter,sans-serif;text-decoration:none}"
       ".lfcamp .sel{display:flex;gap:8px;margin-top:16px}"
       ".lfcamp .sel a{flex:1;display:flex;align-items:center;justify-content:center;height:44px;border-radius:999px;border:1px solid var(--ln2);color:var(--tx);font:500 14px Inter,sans-serif;text-decoration:none}")
HTML = ('<section class="lfcamp" aria-label="Natal La Fouch"><div class="ft" role="img" aria-label="Óculos de sol LaFouch gatinho"></div><div class="tx">'
        '<div class="k">Natal La Fouch</div><h2>O presente que se usa todo dia</h2>'
        '<p class="p">Óculos de sol gatinho · G$ 139.000</p><a class="bt" href="#">Ver presentes</a>'
        '<div class="sel"><a href="#">Para ela</a><a href="#">Para ele</a><a href="#">Para todos</a></div></div></section>')
JS = ("\n/* PINTURA · IDEIAS 06b: Destaque Campanha (molde de data) */\n(function(){var s=document.createElement('style');s.textContent=%r;document.head.appendChild(s);"
      "function poe(){var h=document.getElementById('home');if(!h||!document.documentElement.getAttribute('data-ev')||h.querySelector('.lfcamp'))return;"
      "var d=document.createElement('div');d.innerHTML=%r;h.insertBefore(d.firstChild,h.firstChild)}"
      "setInterval(poe,300);poe()})();\n") % (CSS, HTML)
if __name__ == '__main__':
    shutil.rmtree(DST, ignore_errors=True); shutil.copytree(SRC, DST)
    open(DST + '/js/lf-site.js', 'a').write(JS); print('ok')
