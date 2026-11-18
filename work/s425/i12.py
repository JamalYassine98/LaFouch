import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C)
with sync_playwright() as pw:
  for base in (False,True):
    b,pg,w=ap.abre(pw,'inicio',True,base=base);w(300);pg.evaluate("()=>__LF.setView('estoque')");w(1200)
    print(base,pg.evaluate("()=>document.querySelector('#kCont .lbl').innerHTML"),sorted(comum.olho(pg))[:2]);b.close()
  for base in (False,True):
    b,pg,w=ap.abre(pw,'inicio',True,base=base);w(300)
    for p in D['inventario-ficha']+["()=>scrollTo(0,99999)"]: pg.evaluate(p);w(900)
    print('ficha',base,sorted(comum.olho(pg))[:2]);b.close()
