import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap;from telas import C
from playwright.sync_api import sync_playwright
C=dict(C);C['ajustes']=["()=>window.__LF.setView('ajustes')"];C['marketing']=C.get('marketing')
with sync_playwright() as pw:
  for t,sel in (('hist-lista','[data-act=opendia]'),('ajustes','#ajGrp'),('marketing','.mkPl,[class*=Plano]')):
    b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True)
    for p in C[t]:
      try: pg.evaluate(p)
      except Exception: pass
      w(800)
    print(t,pg.evaluate("s=>{const e=document.querySelector(s);if(!e)return 'nada';const c=getComputedStyle(e);return [e.outerHTML.slice(0,400),c.backgroundColor,c.borderRadius,c.padding,c.border]}",sel))
    if t=='marketing': print(pg.evaluate("()=>{const e=[...document.querySelectorAll('*')].find(x=>x.children.length<6&&/^Seg · Post/.test(x.innerText||''));let p=e;for(let i=0;i<3&&p;i++){p=p.parentElement}return e?[e.outerHTML.slice(0,500),e.parentElement.className]:'nada'}"))
    b.close()
