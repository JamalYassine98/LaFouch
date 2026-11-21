import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
J=open('/home/claude/lafouch/work/kit/abas_dist.js').read()
EX=[('inventario-ficha-site',["()=>{[...document.querySelectorAll('[data-act=fnTab]')].find(x=>x.textContent.trim()=='Site').click()}"])]
R=[]
with sync_playwright() as pw:
  for nome,ps in C:
    b,pg,w=ap.abre(pw,'inicio',True);w(300)
    for p in ps:
      try: pg.evaluate(p)
      except Exception: pass
      w(900)
    try: r=pg.evaluate(J)
    except Exception as e: r=[]
    for x in r: R.append((nome,x['abas'],x['dist'],x['primeiro']))
    b.close()
for x in R: print('%-28s %-40s %4s  %s'%x)
json.dump(R,open('/tmp/s420/abas.json','w'))
