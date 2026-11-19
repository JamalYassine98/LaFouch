import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap;from telas import C
from playwright.sync_api import sync_playwright
C=dict(C)
with sync_playwright() as pw:
  for t in ('catalogo-peca','inventario-ficha','catalogo-pagamento'):
    b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);er=[];pg.on('pageerror',lambda e:er.append(str(e)))
    for p in C[t]:
      try: pg.evaluate(p)
      except Exception: pass
      w(800)
    w(600);print(t,pg.evaluate("()=>[...document.querySelectorAll('.nvVsP,.bk143')].filter(x=>x.getBoundingClientRect().height).map(x=>x.innerText.replace(/\\n/g,'')+' '+getComputedStyle(x).fontSize)"),er[:2]);b.close()
