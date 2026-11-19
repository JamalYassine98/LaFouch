import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap;from telas import C
from playwright.sync_api import sync_playwright
C=dict(C)
with sync_playwright() as pw:
  for t in ('catalogo-peca','inventario-ficha'):
    b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True)
    for p in C[t]:
      pg.evaluate(p);w(800)
    print(t,pg.evaluate("""()=>{const e=[...document.querySelectorAll('button')].find(x=>(x.getAttribute('aria-label')||x.innerText).trim()=='Voltar'&&x.getBoundingClientRect().height);if(!e)return 'nada';e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height,e.outerHTML.slice(0,300),e.parentElement.outerHTML.slice(0,700)]}"""))
    b.close()
