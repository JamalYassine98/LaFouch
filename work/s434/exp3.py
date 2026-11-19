import sys;sys.path.insert(0,'/home/claude/lafouch/work/s349');import ap
sys.path.insert(0,'/home/claude/lafouch/tools/teste-android');from telas import C
from playwright.sync_api import sync_playwright
C=dict(C)
with sync_playwright() as pw:
  b,pg,w=ap.abre(pw,'inicio',True);w(300);pg.evaluate("()=>__LF.setView('din')");w(1200);pg.screenshot(path='/tmp/din.png')
  print(pg.evaluate("()=>{const e=[...document.querySelectorAll('*')].filter(x=>x.offsetHeight&&x.childNodes[0]&&x.childNodes[0].nodeType==3&&/^(Livre|Dinheiro|Reserv)/.test(x.childNodes[0].nodeValue.trim()));return e.map(x=>x.tagName+'.'+x.className+' '+x.parentElement.parentElement.outerHTML.slice(0,700))}"))
  b.close()
