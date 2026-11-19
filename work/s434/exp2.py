import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
C=dict(C)
with sync_playwright() as pw:
  for t in ['caixa-acoes','dash-mes']:
    b,pg,w=ap.abre(pw,'inicio',True);w(300)
    pg.evaluate(C[t][0]);w(900)
    print(t,pg.evaluate("()=>{const v=[...document.querySelectorAll('h1')].find(x=>x.offsetHeight);return v.parentElement.parentElement.outerHTML.slice(0,900)}"))
    print(pg.evaluate("()=>{const e=[...document.querySelectorAll('button,[data-act]')].find(x=>/^(Este mês|Hoje|Esta semana)/.test(x.innerText.trim())&&x.offsetHeight);return e?e.outerHTML.slice(0,400):''}"))
    b.close()
