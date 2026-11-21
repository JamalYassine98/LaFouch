import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True)
  pg.evaluate("()=>{__LF.S.per='custom';__LF.S.perDe='2026-11-01';__LF.S.perAte='2026-11-10';__LF.S.dTab='hoje';__LF.setView('dash')}");w(1500)
  print('CUS',pg.evaluate("()=>document.querySelector('#v-dash').innerHTML.split('<section class=\"kpis')[0]"))
  pg.evaluate("()=>__LF.setView('hist')");w(900);pg.click('[data-act=opendia][data-id=\"2026-11-15\"]');w(1500)
  print('VAZ',pg.evaluate("()=>{const s=[...document.querySelectorAll('#v-dia section.col')].find(x=>/Vendas do dia/.test(x.innerText));return s?s.outerHTML:'-'}")[:800])
  b.close()
