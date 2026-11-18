import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True,base=False);w(300)
  for x in dict(C)['precos']:
    try: pg.evaluate(x)
    except Exception: pass
    w(900)
  print(pg.evaluate("()=>{const e=[...document.querySelectorAll('#v-dash *')].find(x=>x.childNodes[0]&&x.childNodes[0].nodeValue&&x.childNodes[0].nodeValue.trim()=='Preços'&&x.getBoundingClientRect().height);let o=[];let p=e;while(p&&o.length<5){o.push(p.tagName+'.'+p.className+'#'+p.id);p=p.parentElement}return o}"));b.close()
