import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap;from telas import C
from playwright.sync_api import sync_playwright
C=dict(C)
with sync_playwright() as pw:
  for base in (False,True):
    b,pg,w=ap.abre(pw,'inicio',True,'celular',base=base)
    for p in C['hist-lista']: pg.evaluate(p);w(800)
    print(base,pg.evaluate("()=>{const e=document.querySelector('[data-act=opendia]');let x=e,o=[];for(let i=0;i<3;i++){const c=getComputedStyle(x);o.push([x.className,c.backgroundColor,c.borderRadius,c.borderTopWidth]);x=x.firstElementChild||x}return o}"))
    b.close()
