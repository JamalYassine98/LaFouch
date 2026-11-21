import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);pg.evaluate("()=>__LF.setView('hist')");w(1200)
  print(pg.evaluate("()=>document.querySelector('#v-hist').innerHTML.slice(0,3000)"))
  pg.evaluate("()=>{const e=[...document.querySelectorAll('#v-hist button')].find(x=>/filtr/i.test(x.getAttribute('aria-label')||''));e&&e.click()}");w(900)
  print('=====FILT', pg.evaluate("()=>{const e=document.querySelector('#v-hist .chips, #v-hist [class*=filt]');return e?e.outerHTML.slice(0,1500):'?'}"))
  b.close()
