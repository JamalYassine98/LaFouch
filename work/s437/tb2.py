import sys,time;sys.path.insert(0,'/home/claude/lafouch/work/s349');sys.path.insert(0,'/home/claude/lafouch/tools/teste-android')
import ap;from telas import C
from playwright.sync_api import sync_playwright
C=dict(C)
with sync_playwright() as pw:
  for t in ('precos','giro-no-estoque','reservas-30dias'):
    b,pg,w=ap.abre(pw,'inicio',True,'celular',base=True);er=[];pg.on('pageerror',lambda e:er.append(str(e)))
    for p in C[t]:
      try: pg.evaluate(p)
      except Exception: pass
      w(800)
    t0=time.time();pg.evaluate("()=>new Promise(r=>{let n=0;const o=new MutationObserver(()=>n++);o.observe(document.body,{subtree:true,childList:true,characterData:true});setTimeout(()=>{o.disconnect();window.__mut=n;r()},1500)})")
    print(t,'mutações em 1,5 s:',pg.evaluate('()=>window.__mut'),pg.evaluate("()=>[...document.querySelectorAll('[data-act=tabsheet],[data-act=pcAbre],a[data-id=desp]')].filter(x=>x.getBoundingClientRect().height).map(x=>x.textContent.trim()+' '+getComputedStyle(x).fontSize)"),er[:1])
    b.close()
