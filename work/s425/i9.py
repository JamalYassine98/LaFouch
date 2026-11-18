import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C)
with sync_playwright() as pw:
  for n in ['precos','pendencias','giro-parado','despesas-conta','caixa-movimentos']:
    b,pg,w=ap.abre(pw,'inicio',True,base=False);w(300)
    for p in D[n]: pg.evaluate(p);w(800)
    print(n,pg.evaluate("()=>[...document.querySelectorAll('.view')].filter(x=>x.getBoundingClientRect().height).map(x=>x.id)"));b.close()
