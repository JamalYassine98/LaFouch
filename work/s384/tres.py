import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  pg.evaluate("()=>__LF.setView('estoque')");w(900)
  pg.evaluate("()=>document.querySelector('#v-estoque .pcard[data-ref]').click()");w(1200)
  print('lapis',pg.evaluate("()=>[...document.querySelectorAll('[aria-label=Editar]')].map(e=>e.tagName+':'+e.getBoundingClientRect().height)"))
  pg.evaluate("()=>{const e=[...document.querySelectorAll('[aria-label=Editar]')].find(x=>x.getBoundingClientRect().height);e.click()}");w(1400)
  print('modal',pg.evaluate("()=>!!document.getElementById('editModal')"));pg.screenshot(path='/tmp/s384/inventario-editar.png')
  pg.evaluate("()=>__LF.setView('hist')");w(900)
  r=pg.evaluate("()=>{const e=document.querySelector('#v-hist [data-act]');return e&&(e.dataset.act+'|'+e.outerHTML.slice(0,160))}");print('dia',r)
