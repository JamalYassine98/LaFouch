import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
SEL='.sg418,.catbar3,.tmseg,.adSeg,#sortChips,#fFaixas'
with sync_playwright() as pw:
  for v in ['caixa','fx','ajustes','clientes','estoque','dash','vendas','desp']:
    try:
      b,pg,w=ap.abre(pw,v,True,'celular',base=True);w(900)
      if v=='estoque': pg.evaluate("()=>document.getElementById('btnFilt').click()");w(600)
      r=pg.evaluate("s=>[...document.querySelectorAll(s)].map(e=>[e.className||e.id,e.getAttribute('aria-label'),e.getBoundingClientRect().width|0,e.offsetParent!==null])",SEL)
      print(v,r);b.close()
    except Exception as e: print(v,'ERR',str(e)[:80])
