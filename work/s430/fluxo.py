import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C)
H="()=>[document.querySelector('#v-vendas .top h1')?.textContent,document.querySelector('#v-vendas .top .crumb')?.textContent,document.querySelector('.bk143')?.textContent||'-']"
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for x in D['catalogo-pagamento']:
    try: pg.evaluate(x)
    except Exception: pass
    w(900)
  print('pag',pg.evaluate(H))
  pg.evaluate("()=>document.querySelector('.bk143').click()");w(1200);print('volta->',pg.evaluate(H))
  pg.evaluate("()=>document.querySelector('.bk143').click()");w(1200);print('volta->',pg.evaluate(H))
  b.close()
