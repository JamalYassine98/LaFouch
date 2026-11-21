import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  pg.evaluate("()=>__LF.inicioGo('ata')");w(1000)
  print(pg.evaluate("()=>{const e=[...document.querySelectorAll('button')].find(x=>/Novo acesso/.test(x.textContent));e&&e.click();return !!e}"));w(1300)
  pg.screenshot(path='/tmp/s420/aprovado-atacado-novo-acesso-escuro.png')
  pg.evaluate("()=>{const j=[...document.querySelectorAll('.ljJn')].pop();if(j){const c=j.querySelector('.ljCorpo')||j;c.scrollTop=9999}}");w(500)
  pg.screenshot(path='/tmp/s420/aprovado-atacado-novo-acesso-fim-escuro.png')
  print(sorted(comum.olho(pg))[:5]);b.close()
