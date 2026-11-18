import os
import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C)
J=r"""()=>{const o=[];document.querySelectorAll('.view *,.ljJn *').forEach(p=>{if(p.closest('nav'))return;const bs=[...p.children].filter(b=>b.tagName=='BUTTON'&&b.getBoundingClientRect().height);if(bs.length<2||bs.length>5)return;const r=bs.map(b=>b.getBoundingClientRect());if(r.some(x=>Math.abs(x.top-r[0].top)>2))return;const c=getComputedStyle(p),cb=getComputedStyle(bs[0]);o.push(p.tagName+'#'+p.id+'.'+p.className+' | '+bs.map(b=>b.className+':'+b.textContent.trim().slice(0,12)).join(', ')+' | bg '+c.backgroundColor+' bd '+c.border+' | b0 bg '+cb.backgroundColor+' bd '+cb.border+' r '+cb.borderRadius+' h '+r[0].height)});return o}"""
with sync_playwright() as pw:
  for t in os.environ['TS'].split():
    b,pg,w=ap.abre(pw,'inicio',True,base=True);w(300)
    for p in D[t]:
      try: pg.evaluate(p)
      except Exception: pass
      w(900)
    print('==',t);[print('  ',x[:330]) for x in pg.evaluate(J)];b.close()
