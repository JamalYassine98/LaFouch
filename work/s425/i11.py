import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C)
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for p in D['inventario-fornecedores']: pg.evaluate(p);w(900)
  pg.evaluate("()=>document.querySelector('#lotView .trash').click()");w(800)
  print(pg.evaluate("()=>document.querySelector('#lotView>section.card').innerText"))
  pg.screenshot(path='/tmp/s425/trash.png');b.close()
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for p in D['despesas-nova']: pg.evaluate(p);w(900)
  print(pg.evaluate("()=>{const e=[...document.querySelectorAll('#v-desp section,#v-desp details,#v-desp div')].filter(x=>/^Nova despesa/.test((x.innerText||'').trim())&&x.getBoundingClientRect().height);const t=e[0];return t.tagName+'.'+t.className+' id='+t.id+' :: '+t.outerHTML.slice(0,300)}"))
  print(pg.evaluate("()=>{const k=document.getElementById('kCont');return k?k.outerHTML.slice(0,300):'sem kCont'}"))
  b.close()
