import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
A2=open('/home/claude/lafouch/work/verif/alin2.js').read()
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for x in dict(C)['guardiao']:
    try: pg.evaluate(x)
    except Exception: pass
    w(1000)
  w(600);[print(x['r'],x['ex']) for x in pg.evaluate(A2)];b.close()
