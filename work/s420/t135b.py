import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
D=dict(C)
from playwright.sync_api import sync_playwright
R="""const r=e=>{const q=e.getBoundingClientRect();return [Math.round(q.left),Math.round(q.top),Math.round(q.right),Math.round(q.bottom)]};"""
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(400)
  for p in D['inventario-ficha']: pg.evaluate(p);w(1100)
  print(pg.evaluate("()=>{"+R+"const g=[...document.querySelectorAll('#v-estoque *')].find(x=>/^GRAUS/i.test(x.textContent.trim())&&x.children.length==0);return g.parentElement.outerHTML.slice(0,1500)}"))
  for t in ('Histórico','Site','Preço'):
    pg.evaluate("t=>{const b=[...document.querySelectorAll('button')].filter(x=>x.getBoundingClientRect().height&&x.textContent.trim()==t);b[0]&&b[0].click()}",t);w(1200)
    pg.screenshot(path='/tmp/s420/t_%s.png'%t[0],full_page=False)
    h=pg.evaluate("()=>document.documentElement.scrollHeight");print(t,h)
    pg.evaluate("()=>scrollTo(0,99999)");w(400);pg.screenshot(path='/tmp/s420/t_%s2.png'%t[0]);pg.evaluate("()=>scrollTo(0,0)")
  b.close()
  b,pg,w=ap.abre(pw,'inicio',True);w(400)
  for p in D['inventario-fornecedores']: pg.evaluate(p);w(1100)
  print(pg.evaluate("()=>{"+R+"const s=document.querySelector('#lotView>section.card');return s.outerHTML.slice(0,2500)+' || '+[...s.querySelectorAll('button')].map(x=>x.textContent.trim()+r(x)).join(' ; ')}"))
  b.close()
