import sys,os,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C);D['atacado-lotes']=D['atacado-lotes'];
J=open('insp2.js').read()
with sync_playwright() as pw:
  for t,q in json.loads(os.environ['Q']):
    b,pg,w=ap.abre(pw,'inicio',True);w(300)
    for x in D.get(t,[]):
      try: pg.evaluate(x)
      except Exception: pass
      w(900)
    print('==',t);[print('  ',l) for l in pg.evaluate(J,q)];b.close()
