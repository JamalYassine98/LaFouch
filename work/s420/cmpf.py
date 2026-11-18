import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);pg.set_viewport_size({'width':360,'height':756});w(600)
  for p in D['inventario-ficha']: pg.evaluate(p);w(1100)
  print(pg.evaluate("()=>[getComputedStyle(document.body).fontFamily,document.fonts.check('15px Roboto')]"))
  pg.screenshot(path='/tmp/s420/sim360.png');b.close()
