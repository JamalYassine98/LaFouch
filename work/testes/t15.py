import sys;sys.path.insert(0,'/home/claude/gz');from base import *
from t5 import espera,clica,ate_teste
W=int(sys.argv[1]) if len(sys.argv)>1 else 390
for ev in ['natal','halloween','bf','anonovo-n']:
  with sync_playwright() as p:
    b,pg,errs=abre(p,perm=False,W=W,ls={'t_perm':'granted'})
    pg.goto('http://localhost:8771/');pg.wait_for_timeout(1500);pg.evaluate(f"document.documentElement.setAttribute('data-ev','{ev}');window.__lfGzAbre()")
    pg.wait_for_timeout(2600);pg.screenshot(path=f'/tmp/th_{ev}_a.png')
    pg.click('#gw [data-gz=comeca]');pg.wait_for_timeout(2200);pg.screenshot(path=f'/tmp/th_{ev}_b.png')
    ate_teste(pg);espera(pg,"__LFGZ.Z.qt>0",30000);pg.wait_for_timeout(800);pg.screenshot(path=f'/tmp/th_{ev}_c.png')
    print(ev,'ERR',[e for e in errs if 'TUNNEL' not in e and 'XNNPACK' not in e]);b.close()
