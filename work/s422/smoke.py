import sys;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
  for W in (390,1440):
    b,pg,er=base.abre(p,W=W,H=900);pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.goto('http://localhost:8997/');pg.wait_for_timeout(2500);n=pg.evaluate("document.querySelectorAll('#home .hc').length");g=pg.evaluate("!!document.getElementById('lfgrv')")
    print(W,'peças',n,'botão gravação sem ?medir',g,[x for x in er if 'Failed' not in x][:3]);b.close()
