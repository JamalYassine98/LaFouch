import sys,os;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap;from telas import C
from playwright.sync_api import sync_playwright
J=r"""()=>{const b=[...document.querySelectorAll('.vltRow')].filter(x=>x.getBoundingClientRect().height)[0];if(!b)return 'sem';const r=b.getBoundingClientRect(),c=getComputedStyle(b);const sib=b.parentElement.lastElementChild.getBoundingClientRect();return [b.innerText.replace(/\n/g,''),c.fontSize,c.textTransform,Math.round(r.x),Math.round(r.top+r.height/2),Math.round(sib.top+sib.height/2)]}"""
with sync_playwright() as pw:
  for apx in ('celular','tablet','pc'):
    for esc in (True,False):
      for t in ('catalogo-peca','inventario-ficha'):
        b,pg,w=ap.abre(pw,'inicio',esc,apx,base=False)
        for p in dict(C)[t]:
          try: pg.evaluate(p)
          except Exception: pass
          w(500)
        r=pg.evaluate(J);print(apx,'escuro' if esc else 'claro',t,r)
        if apx=='celular': pg.screenshot(path='real_%s_%s.png'%(t,'escuro' if esc else 'claro'))
        b.close()
