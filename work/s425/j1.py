import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  for esc in (True,False):
    b,pg,w=ap.abre(pw,'inicio',esc);w(300);pg.evaluate("()=>__LF.setView('clientes')");w(900);pg.evaluate("()=>document.querySelector('[data-act=clinovo]').click()");w(1200)
    print(esc,sorted(comum.olho(pg))[:4]);pg.screenshot(path='/tmp/s425/nc_%d.png'%esc);b.close()
