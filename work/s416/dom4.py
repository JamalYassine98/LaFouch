import sys,re;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
def limpa(h): return re.sub(r'<svg.*?</svg>','<svg/>',h)
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True)
  pg.evaluate("()=>{__LF.S.per='semana';__LF.S.dTab='hoje';__LF.setView('dash')}");w(1500)
  print('SEM',limpa(pg.evaluate("()=>document.querySelector('#v-dash').innerHTML"))[:5000])
  pg.evaluate("()=>__LF.setView('hist')");w(900);pg.click('[data-act=opendia][data-id=\"2026-11-16\"]');w(1500)
  print('DIA',limpa(pg.evaluate("()=>document.querySelector('#v-dia').innerHTML"))[:3500])
  b.close()
