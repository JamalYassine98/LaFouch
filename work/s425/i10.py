import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
D=dict(C)
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300)
  for p in D['precos']: pg.evaluate(p);w(900)
  print(pg.evaluate("""()=>{const e=[...document.querySelectorAll('#v-dash *')].filter(x=>/^G\\$ 26/.test((x.textContent||'').trim())&&x.children.length==0);return e.map(x=>x.tagName+'.'+x.className+' ff='+getComputedStyle(x).fontFamily+' flag='+x.dataset.b135f+' inline='+x.style.fontFamily+' ::'+x.outerHTML.slice(0,120))}"""))
  b.close()
