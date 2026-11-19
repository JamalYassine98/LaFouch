import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  for a in ('tablet','pc'):
    b,pg,w=ap.abre(pw,'caixa',True,ap=a);w(900);pg.screenshot(path='/tmp/%s.png'%a)
    print(a,pg.evaluate("()=>{const n=document.querySelector('#mainnav');const r=n.getBoundingClientRect();return [r.x,r.y,r.width,r.height]}"))
    b.close()
