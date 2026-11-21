import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True)
  pg.evaluate("()=>{__LF.S.per='semana';__LF.S.dTab='hoje';__LF.setView('dash')}");w(1500)
  print('SEM',pg.evaluate("()=>{const v=document.querySelector('.view:not([hidden])');return v.id+' '+[...v.children].map(c=>c.tagName+'.'+c.className+':'+c.innerText.slice(0,60).replace(/\\n/g,'|')).join('\\n')}"))
  pg.evaluate("()=>__LF.setView('hist')");w(900);pg.click('[data-act=opendia][data-id=\"2026-11-16\"]');w(1500)
  print('DIA',pg.evaluate("()=>{const v=document.querySelector('.view:not([hidden])');return v.id+' '+[...v.children].map(c=>c.tagName+'.'+c.className+':'+c.innerText.slice(0,60).replace(/\\n/g,'|')).join('\\n')}"))
  b.close()
