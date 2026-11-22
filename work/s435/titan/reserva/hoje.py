import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);w(600)
  pg.evaluate("()=>window.__LF.inicioGo('notif')");w(1200)
  print(pg.evaluate("()=>window.__LF.S.view"))
  pg.screenshot(path='hoje_notif.png')
  print(pg.evaluate("()=>{const v=document.getElementById('v-'+window.__LF.S.view);return v?v.innerHTML.slice(0,2500):''}"))
  print(pg.evaluate("()=>(window.__LF.S.pedidos||[]).map(p=>[p.num,p.orig,p.st]).slice(-5)"))
  b.close()
