import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap,comum
exec(open('esb134r.py').read().split('BL=[[')[0])
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(400);aba('Site')(pg,w)
  pg.add_style_tag(content=PN);print(pg.evaluate(JT));w(400)
  print(pg.evaluate("()=>{const a=document.querySelector('#v-estoque .fnAt');const q=a.getBoundingClientRect();return [a.parentElement.className,q.top,q.height,getComputedStyle(a).display,a.outerHTML.slice(0,200), document.querySelector('#v-estoque .fnPane').parentElement.className]}"))
