import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'estoque',True,'celular',base=True);w(600)
  print(pg.evaluate("()=>[window.__LF.S.view,(window.__LF.S.estPend||[]).length,!!document.getElementById('btnAdd')]"))
  pg.evaluate("()=>document.getElementById('btnAdd').click()");w(900)
  pg.screenshot(path='hoje_adicionar_escuro.png')
  b.close()
