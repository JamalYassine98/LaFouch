import sys,time;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C)
L=[('ficha',D['inventario-ficha']+["()=>scrollTo(0,99999)"]),('forn',D['inventario-fornecedores']+["()=>document.querySelector('#lotView .trash').click()"]),('estoque',["()=>__LF.setView('estoque')"]),('desp',D['despesas-nova']),('desp-lista',D['despesas-conta'])]
with sync_playwright() as pw:
  for n,ps in L:
    b,pg,w=ap.abre(pw,'inicio',True);w(300)
    for p in ps: pg.evaluate(p);w(900)
    w(600);print(n,sorted(comum.olho(pg))[:3],pg.evaluate("()=>[document.querySelectorAll('.lfCf').length,(document.querySelector('#kCont .lbl')||{}).innerText]"));pg.screenshot(path='/tmp/s425/b136_%s.png'%n);b.close()
