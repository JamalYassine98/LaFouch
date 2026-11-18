import sys,json,subprocess,time;sys.path.insert(0,'/home/claude/lafouch/work/testes');import base
from playwright.sync_api import sync_playwright
S=[subprocess.Popen([sys.executable,'/home/claude/lafouch/work/s415/srv.py',p,d],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL) for p,d in (('8993','/tmp/est_a'),('8994','/tmp/est_b'))];time.sleep(1.2)
with sync_playwright() as p:
  for porta in (8993,8994):
    b,pg,er=base.abre(p,W=390,H=844);pg.context.route('**/*',lambda r:r.continue_() if r.request.url.startswith('http://localhost') else r.abort())
    pg.goto('http://localhost:%d/'%porta);pg.wait_for_timeout(2500);pg.click('#sbtn');pg.wait_for_timeout(1500)
    print(porta,pg.evaluate("()=>{const o=document.querySelector('#sov');return o?o.innerText.slice(0,500):null}"));print([e for e in er if 'Failed' not in e][:3])
    b.close()
for s in S:s.kill()
