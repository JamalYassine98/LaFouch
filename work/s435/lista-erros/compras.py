import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/work/kit');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=False);w(800);pg.evaluate("()=>__LF.inicioGo('comp')");w(1200)
  print(pg.evaluate("()=>[...document.querySelectorAll('.view:not([hidden]) button')].filter(b=>b.getBoundingClientRect().height).map(b=>b.textContent.trim().replace(/\\s+/g,' ').slice(0,40)).slice(-8)"))
  pg.screenshot(path='p2_Compras_full_esc.png',full_page=True);b.close()
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=False);w(800);pg.evaluate("()=>__LF.inicioGo('estoque')");w(1200)
  print(pg.evaluate("()=>[...document.querySelectorAll('.view:not([hidden]) button,.view:not([hidden]) [data-act]')].filter(b=>b.getBoundingClientRect().height).map(b=>b.textContent.trim().replace(/\\s+/g,' ').slice(0,40)).slice(0,10)"))
  b.close()
