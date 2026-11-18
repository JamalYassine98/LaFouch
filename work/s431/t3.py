import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for x in dict(C)['reservas-para-onde']:
    try: pg.evaluate(x)
    except Exception: pass
    w(900)
  print(pg.evaluate("""()=>{const f=e=>{const c=getComputedStyle(e),r=e.getBoundingClientRect();return e.tagName+'.'+e.className+' T'+Math.round(r.top)+' B'+Math.round(r.bottom)+' L'+Math.round(r.left)+' m'+c.margin+' p'+c.padding+' h'+c.height+' minh'+c.minHeight}
 const d=document.querySelector('#v-dash .dHd');const o=[f(d)];[...d.children].forEach(x=>o.push(' '+f(x)));o.push(f(d.nextElementSibling));
 const s=[...document.querySelectorAll('#v-dash .split .sl')].find(x=>x.getBoundingClientRect().height);let p=s;for(let k=0;k<5;k++){o.push('>'+f(p));p=p.parentElement}return o}"""))
  b.close()
