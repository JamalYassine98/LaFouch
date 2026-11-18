import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(400)
  for p in D['inventario-ficha']: pg.evaluate(p);w(1100)
  for t in ('Histórico','Site','Preço'):
    pg.evaluate("t=>{const b=[...document.querySelectorAll('button')].filter(x=>x.getBoundingClientRect().height&&x.textContent.trim()==t);b[0].click()}",t);w(1000)
    print(t,pg.evaluate("()=>{const a=document.querySelector('#v-estoque .fnBar');let n=a.nextElementSibling;let o='';while(n){o+=n.outerHTML.slice(0,900)+'\\n';n=n.nextElementSibling};return 'PARENT '+a.parentElement.className+' / '+a.outerHTML.slice(0,700)+'\\n'+o}"))
  b.close()
