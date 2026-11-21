import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for x in dict(C)['catalogo-pagamento']:
    try: pg.evaluate(x)
    except Exception: pass
    w(900)
  w(800)
  print(pg.evaluate("()=>[...document.querySelectorAll('.trk')].filter(t=>t.offsetWidth).map(t=>{const th=t.querySelector('.trkTh').getBoundingClientRect(),on=t.querySelector('.trkB.on').getBoundingClientRect(),tr=t.getBoundingClientRect();return [Math.round(th.left-on.left),Math.round(th.width-on.width),Math.round(th.left-tr.left),Math.round(tr.bottom-th.bottom)]})"))
  pg.screenshot(path='/tmp/s430/tk.png',clip={'x':0,'y':300,'width':390,'height':260});b.close()
