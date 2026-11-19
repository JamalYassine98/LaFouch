import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'caixa',True);w(800)
  pg.evaluate("()=>__LF.ACT.grpGerirV('g:din')");w(1000)
  print(pg.evaluate("()=>{const j=[...document.querySelectorAll('.ljJn,.dFolha,[id=dFolha]')].filter(x=>x.offsetHeight).pop();return j?[j.querySelectorAll('svg').length,j.innerText.slice(0,200)]:'nada'}"))
  pg.screenshot(path='/tmp/gg.png');b.close()
