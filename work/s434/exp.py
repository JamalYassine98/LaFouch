import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'caixa',True);w(800)
  print(pg.evaluate("()=>JSON.stringify((__LF.S.grupos||[]).map(g=>[g.id,g.nome,g.itens]))"))
  print(pg.evaluate("()=>[__LF.S.view,__LF.S._gAt]"))
  pg.screenshot(path='/tmp/s434_caixa.png')
  pg.evaluate("()=>__LF.setView('hoje')");w(900);print(pg.evaluate("()=>[__LF.S.view,__LF.S._gAt]"));pg.screenshot(path='/tmp/s434_dash.png')
  b.close()
