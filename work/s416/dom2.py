import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);pg.evaluate("()=>__LF.setView('hist')");w(1200)
  pg.click('[data-act=hfopen]');w(900)
  print('FILT',pg.evaluate("()=>{const r=document.querySelector('#hRes');return document.querySelector('#v-hist').innerHTML.split('hDate')[1].slice(0,1400)}"))
  pg.click('[data-act=hfopen]');w(600)
  pg.fill('#hq','SL');w(1200)
  print('BUSCA',pg.evaluate("()=>document.querySelector('#hRes').innerHTML.slice(0,1500)"))
  b.close()
