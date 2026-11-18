import sys,json;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
J=open('alin2.js').read();D=dict(C)
with sync_playwright() as pw:
  for nome in ['dash-contas-dia','inventario-ficha','caixa-conferir','precos','atacado-tabela','reservas-para-onde']:
    b,pg,w=ap.abre(pw,'inicio',True);w(300)
    for p in D.get(nome,[]):
      try: pg.evaluate(p)
      except Exception: pass
      w(900)
    r=pg.evaluate(J);print(nome,len(r));[print('   ',x['r'],x['ex']) for x in r[:8]];b.close()
